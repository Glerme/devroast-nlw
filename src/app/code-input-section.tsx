"use client";

import { useState } from "react";
import { Button, CodeEditor, Toggle } from "@/components/ui";

const placeholderCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }

  // TODO: handle tax calculation
  // TODO: handle currency conversion

  return total;
}`;

export function CodeInputSection() {
  const [code, setCode] = useState(placeholderCode);

  return (
    <div className="flex w-full max-w-[780px] flex-col gap-8">
      <CodeEditor value={code} onChange={setCode} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Toggle
            label="roast mode"
            hint="// maximum sarcasm enabled"
            defaultChecked
          />
        </div>
        <Button>$ roast_my_code</Button>
      </div>
    </div>
  );
}
