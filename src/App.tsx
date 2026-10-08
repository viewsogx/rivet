import { createEffect, createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { BsSendFill } from "solid-icons/bs";

function App() {
  const [response, set_response] = createSignal("");
  const [address, set_address] = createSignal("");
  const [environment, set_environment] = createSignal("");
  const [port, set_port] = createSignal("");
  const [endpoint, set_endpoint] = createSignal("");

  async function send_request() {
    let addr =
      environment() === "dev"
        ? "http://localhost:" + port() + endpoint()
        : address();

    if (environment() === "prod" && !addr.includes("https://"))
      addr = "https://" + addr;
    console.log(addr);
    set_response(
      await invoke("send_request", {
        address: addr,
        method: "GET",
        payload: "asd",
      }),
    );
  }

  createEffect(() => {
    if (localStorage.getItem("endpoint"))
      set_endpoint(localStorage.getItem("endpoint")!);
    if (localStorage.getItem("port")) set_port(localStorage.getItem("port")!);
    if (localStorage.getItem("address"))
      set_address(localStorage.getItem("address")!);
  });

  return (
    <main class="container">
      <img src="logo.png" class="logo w-1/15" />

      <form
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          send_request();
        }}
      >
        <div class="flex gap-4 m-5">
          <select onChange={(e) => set_environment(e.currentTarget.value)}>
            <option value={"dev"}>Development (localhost)</option>
            <option value={"prod"}>Production</option>
          </select>
          <div class="flex gap-2 bg-amber-200 p-5 rounded-2xl">
            {environment() === "prod" ? (
              <input
                id="prod_input"
                onChange={(e) => set_address(e.currentTarget.value)}
                placeholder="Enter an address"
                value={address()}
              />
            ) : (
              <div class="gap-2 flex">
                <input
                  id="port_input"
                  onChange={(e) => set_port(e.currentTarget.value)}
                  placeholder="PORT"
                  value={port()}
                />
                <input
                  id="endpoint_input"
                  onChange={(e) => {
                    set_endpoint(e.currentTarget.value);
                    localStorage.setItem("endpoint", e.currentTarget.value);
                  }}
                  placeholder="/endpoint"
                  value={endpoint()}
                />
              </div>
            )}
          </div>

          <button type="submit" id="send_req_btn">
            <BsSendFill />
          </button>
        </div>
      </form>
      <div class="border-[#F08080] border rounded p-5 m-10 bg-gray-800">
        <pre>{response()}</pre>
      </div>
    </main>
  );
}

export default App;
