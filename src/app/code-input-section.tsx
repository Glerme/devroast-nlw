"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, CodeEditor, Toggle } from "@/components/ui";

export function CodeInputSection() {
  const [code, setCode] = useState("");
  const router = useRouter();

  function handleRoast() {
    const id = crypto.randomUUID().slice(0, 8);
    router.push(`/roast/${id}`);
  }

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
        <Button onClick={handleRoast}>$ roast_my_code</Button>
      </div>
    </div>
  );
}
