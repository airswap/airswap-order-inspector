import { Button } from "./features/ui/button";
import { useState } from "react";
import { cn } from "./lib/utils";
import { useValidateOrder } from "./hooks/useValidateOrder";

function App() {
  const [urlMode, setUrlMode] = useState<boolean>(false);

  // NOTE: would probably be nicer to default this to
  const [selectedChainId, setselectedChainId] = useState<number>(1);

  const [orderText, setOrderText] = useState<string>("");

  const {
    orderErrors,
    contractCallError,
    orderParsingError,
    schemaValidationError,
  } = useValidateOrder({
    order: orderText,
    isUrl: urlMode,
    onSetChain: (newId) => {
      if (selectedChainId !== newId) setselectedChainId(newId);
    },
  });

  return (
    <main className="container flex h-full flex-col gap-4">
      <h1>Order checker</h1>
      <div className="flex gap-2">
        <button
          onClick={() => setUrlMode(false)}
          className={cn({
            underline: !urlMode,
          })}
        >
          text mode
        </button>
        <button
          onClick={() => setUrlMode(true)}
          className={cn({
            underline: urlMode,
          })}
        >
          URL mode
        </button>
      </div>

      {urlMode ? (
        <div>
          <input type="text" placeholder="Enter URL" className="w-full" />
          <Button>Check</Button>
        </div>
      ) : (
        <div>
          <textarea
            value={orderText}
            onChange={(e) => setOrderText(e.target.value)}
            placeholder="Enter order text"
            className="w-full text-black"
            rows={10}
          />
          <Button>Check</Button>
        </div>
      )}

      <pre className="whitespace-pre">
        {JSON.stringify(
          {
            orderErrors,
            contractCallError,
            orderParsingError,
            schemaValidationError,
          },
          null,
          2,
        )}
      </pre>
    </main>
  );
}

export default App;
