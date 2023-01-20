#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use rusqlite::{Connection, Result};
use rusqlite::NO_PARAMS;
use std::sync::Mutex;
// external crate, because Mutex::new can't be used to initialize a static variable until Rust 1.63.
use once_cell::sync::Lazy;
use pyo3::prelude::*;
use pyo3::types::PyTuple;
static GOAL: Lazy<Mutex<String>> = Lazy::new(|| Mutex::new(String::new()));

#[derive(Debug)]
struct Account {
    id: i64,
    name: String,
    social: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str, social: &str ) -> String {
    insertValues(name, social);
    get_accs();
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn create_database() -> Result<()>{
    let mut conn = Connection::open("../accounts.sqlite")?;
    let tx = conn.transaction()?;
    tx.execute("CREATE TABLE if not exists accounts (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        social TEXT NOT NULL
    )", NO_PARAMS, )?;
    tx.commit()
}

#[tauri::command]
fn get_my_accs() -> String {
    get_accs();
    format!("{}",*GOAL.lock().unwrap())
}

#[tauri::command]
fn delete_my_acc(name: &str) -> String {
    delete_acc(name);
    format!("Deleted!")
}

#[tauri::command]
fn auth_selenium(name: &str, social: &str) -> String{
    println!("{}", &name);
    start_selenium_auth(name, social);
    format!("Auth started!")
}

#[tauri::command]
fn startTask(users: &str, acc_name: &str, messages: &str) -> String {
    start_selenium_task(users, acc_name, messages);
    format!("start")
   
    
}

fn start_selenium_task(users: &str, acc_name: &str, messages: &str) -> PyResult<()>{
    Python::with_gil(|py| {
        let fun: Py<PyAny> = PyModule::from_code(
            py,
            "def example(users, acc_name, messages):
                from selenium import webdriver
                from selenium.webdriver.common.keys import Keys
                from selenium.webdriver.common.by import By
                from selenium.webdriver.support.wait import WebDriverWait
                from selenium.webdriver.support import expected_conditions as EC
                from selenium.common.exceptions import ElementNotVisibleException, ElementNotSelectableException
                from time import sleep
                from random import randint

                users = users.replace(' ', '')
                users = users.split(',')
                acc_name = acc_name.replace('_run', '')
                messages = messages.replace('{', '')
                messages = messages.replace('}', '')
                messages = messages.split('|')
                print(messages, users)
                print(f'Acc name: {acc_name}')
                options = webdriver.ChromeOptions()
                options.add_argument(f'--user-data-dir=/home/alchemist/Desktop/{acc_name}/selenium')
                driver = webdriver.Chrome(options=options)
                for i in users:
                    try:
                        driver.get('https://web.telegram.org/k/#' + i)
                        sleep(15)
                        message_area = driver.find_element(By.XPATH, '/html/body/div[1]/div[1]/div[2]/div/div/div[4]/div/div[1]/div/div[8]/div[1]/div[1]')
                        message_area.clear()
                        message_area.send_keys(messages[randint(0, len(messages)-1)])
                        sleep(5)
                        message_area.send_keys(Keys.ENTER)
                        sleep(5)
                    except:
                        pass
            
            
            ",
            "",
            "",
        )?.getattr("example")?.into();
        let args = (users, acc_name, messages);
        fun.call1(py, args)?;
        Ok(())
    })
}

fn start_selenium_auth(name: &str, social: &str) -> PyResult<()> {
    Python::with_gil(|py| {
        let fun: Py<PyAny> = PyModule::from_code(
            py,
            "def example(name, social):
                from selenium import webdriver
                from selenium.webdriver.common.keys import Keys
                from selenium.webdriver.common.by import By
                from selenium.webdriver.support.wait import WebDriverWait
                from selenium.webdriver.support import expected_conditions as EC
                from selenium.common.exceptions import ElementNotVisibleException, ElementNotSelectableException
                from time import sleep
                import pathlib
                options = webdriver.ChromeOptions()
                options.add_argument(f'--user-data-dir=/home/alchemist/Desktop/{name}/selenium')
                driver = webdriver.Chrome(options=options)
                driver.get('https://web.telegram.org/k/#')
                wait = WebDriverWait(driver, timeout=120, poll_frequency=3, ignored_exceptions=[ElementNotVisibleException, ElementNotSelectableException])
                element = wait.until(EC.element_to_be_clickable((By.XPATH, '/html/body/div[1]/div[1]/div[1]/div/div/div[1]/div[1]/button/div')))
                print('auth successfully')
                print(f'{name} {social}')",
            "",
            "",
        )?.getattr("example")?.into();
        let args = (name, social);
        fun.call1(py, args)?;
        Ok(())
    })
}

fn delete_acc(name: &str) -> Result<()> {
    let mut conn = Connection::open("../accounts.sqlite")?;
    let tx = conn.transaction()?;
    let mut query: String = "DELETE FROM accounts WHERE name = '".to_string() + &name.to_string() + &"'".to_string();
    println!("{}",query);
    tx.execute(&query, NO_PARAMS)?;
    tx.commit()
}
fn get_accs() -> Result<()>{
    let mut conn = Connection::open("../accounts.sqlite")?;
    let mut stmt = conn.prepare("SELECT * FROM accounts")?;
    let accounts = stmt.query_map(NO_PARAMS, |row| {
        Ok(Account {
            id: row.get(0)?,
            name: row.get(1)?,
            social: row.get(2)?
        })
    })?;
    
    let mut json_string: String = "{ \"accounts\": [".to_string();
    for acc in accounts{
        let account = acc.unwrap();
        let formatted = format!("{{ \"name\":\"{0}\", \"id\":\"{1}\", \"social\":\"{2}\" }},", account.name, account.id, account.social);
        json_string += &formatted.to_string();
    }
    json_string += &"]}".to_string();
    *GOAL.lock().unwrap() = json_string;
    println!("{}", *GOAL.lock().unwrap());
    Ok(())
}

fn insertValues(name: &str, social: &str) -> Result<()>{
    println!("{} - {}", name, social);
    let mut conn = Connection::open("../accounts.sqlite")?;
    let tx = conn.transaction()?;
    tx.execute("INSERT INTO accounts (name, social) VALUES (?1, ?2)", (name, social),)?;
    tx.commit()
}

fn main(){
    create_database();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_my_accs, delete_my_acc, auth_selenium, startTask])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
