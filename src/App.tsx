import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { BsSendFill } from "solid-icons/bs";

function App() {
  const [response, set_response] = createSignal("");
  const [address, set_address] = createSignal("");

  async function send_request() {
    set_response(await invoke("send_request", { address: address() , method:"GET", payload:"asd"}));
  }

  return (
    <main class="container">
      <h1>Rivet</h1>

      <form
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          send_request();
        }}
      >
        <input
          id="input"
          onChange={(e) => set_address(e.currentTarget.value)}
          placeholder="Enter an address"
        />
        <button type="submit">
          <BsSendFill />
        </button>
      </form>
      <pre>{response()}</pre>
    </main>
  );
}

export default App;
