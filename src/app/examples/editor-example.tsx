"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/ui";

const sampleCode = `function calculateTotal(items) {
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

export function EditorExample() {
	const [code, setCode] = useState(sampleCode);

	return <CodeEditor value={code} onChange={setCode} />;
}
