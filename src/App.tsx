import { useState } from "react";
import Select from "react-select";
import { toDataURL } from "qrcode";
import { getFpsCode, PHONE_PREFIXES, type Option, type ReceiverType } from "./utils";

const SELECT_BACKGROUND_COLOR = "#3b3b3b";

function RequiredSymbol() {
  return <span style={{ color: "indianred" }}>*</span>;
}

function App() {
  const [receiverType, setReceiverType] = useState<ReceiverType>("FpsId");
  const [phonePrefix, setPhonePrefix] = useState<Option | null>(PHONE_PREFIXES.find(o => o.value === "+852")!);
  const [receiver, setReceiver] = useState("");
  const [currency, setCurrency] = useState("344");
  const [amount, setAmount] = useState("");
  const [billNumber, setBillNumber] = useState("");

  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  const [dataUrl, setDataUrl] = useState("");

  return (
    <>
      <h2>Faster Payment System (FPS) QR Code Generator</h2>
      <form onSubmit={e => {
        e.preventDefault();
        const code = getFpsCode(receiverType, (receiverType === "PhoneNumber" ? phonePrefix!.value + "-" : "") + receiver, amount, currency, { billNumber });
        setCode(code);
        toDataURL(code, { errorCorrectionLevel: "L", margin: 1 }).then(setDataUrl);
      }}>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Receiver <RequiredSymbol /></label>
              </td>
              <td>
                <div style={{ display: "flex", gap: ".5em" }}>
                  <select value={receiverType} onChange={e => setReceiverType(e.target.value as ReceiverType)}>
                    <option value="FpsId">FPS ID</option>
                    <option value="PhoneNumber">Phone No.</option>
                    <option value="EmailAddress">Email Address</option>
                  </select>
                  {receiverType === "PhoneNumber" && <Select
                    options={PHONE_PREFIXES}
                    value={phonePrefix}
                    onChange={setPhonePrefix}
                    styles={{
                      control: (base) => ({
                        ...base,
                        width: "273px",
                        backgroundColor: SELECT_BACKGROUND_COLOR,
                      }),
                      menu: (base) => ({
                        ...base,
                        width: "max-content",
                        backgroundColor: SELECT_BACKGROUND_COLOR,
                      }),
                      option: (base, props) => ({
                        ...base,
                        whiteSpace: "nowrap",
                        backgroundColor: props.isFocused ? "#505050" : "transparent",
                      }),
                      input: (base) => ({
                        ...base,
                        color: "inherit",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "inherit",
                      }),
                    }}
                  />}
                  <input
                    name={receiverType === "FpsId" ? "fpsId" : receiverType === "PhoneNumber" ? "phone" : "email"}
                    value={receiver}
                    onChange={e => setReceiver(e.target.value)}
                    required
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <label>Transaction Amount <RequiredSymbol /></label>
              </td>
              <td>
                <div style={{ display: "flex", gap: ".5em" }}>
                  <select value={currency} onChange={e => setCurrency(e.target.value)}>
                    <option value="344">HKD</option>
                    <option value="156">CNY</option>
                  </select>
                  <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <label>Bill Number</label>
              </td>
              <td>
                <input value={billNumber} onChange={e => setBillNumber(e.target.value)} />
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ padding: ".25em .5em" }}>
          <button>Generate QR Code</button>
        </div>
      </form>
      {code && <>
        <h3 style={{ marginBottom: ".5em" }}>Data</h3>
        <div style={{ display: "flex", alignItems: "center", gap: ".5em" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".5em",
            padding: ".25em .5em",
            border: "1px solid #858585",
            borderRadius: ".25em" }}
          >
            {code} <button onClick={() => {
              navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 800);
            }}>
              Copy
            </button>
          </div>
          {copied && <span>Copied</span>}
        </div>
      </>}
      {dataUrl && <>
        <h3 style={{ marginBottom: ".5em" }}>QR Code</h3>
        <div style={{ textAlign: "center" }}>
          <img src={dataUrl} />
        </div>
      </>}
    </>
  )
}

export default App
