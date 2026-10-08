use reqwest::Client;

#[tauri::command]
async fn send_request(address: &str, method: &str, payload: &str) -> Result<String, String> {
    let client = Client::new();
    let response = match method {
        "GET" => client
            .get(address)
            .send()
            .await
            .map_err(|e| e.to_string())?,
        "POST" => client
            .post(address)
            .body(payload.to_owned())
            .header("Content-Type", "application/json")
            .send()
            .await
            .map_err(|e| e.to_string())?,

        _ => return Err(format!("Unsupported HTTP method: {}", method)),
    };

    return response.text().await.map_err(|e| e.to_string());
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![send_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
