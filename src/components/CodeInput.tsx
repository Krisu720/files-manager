import useMounted from "@/hooks/use-mounted";
import { useEffect, useRef } from "react";

const CodeInput = ({
  value,
  setValue,
  onComplete,
}: {
  value: [string, string, string, string];
  setValue: React.Dispatch<
    React.SetStateAction<[string, string, string, string]>
  >;
  onComplete?: () => void;
}) => {
  const mounted = useMounted();
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mounted) firstInput.current?.focus();
  }, [mounted]);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const prevElement = e.currentTarget
      .previousElementSibling as HTMLInputElement | null;
    const nextElement = e.currentTarget
      .nextElementSibling as HTMLInputElement | null;

    if (prevElement && e.key === "Backspace") {
      prevElement.focus();
    } else if (e.currentTarget.value.length > 0) {
      if (nextElement) nextElement.focus();
      else typeof onComplete !== "undefined" && onComplete();
    }
  };

  return (
    <>
      <input
        ref={firstInput}
        className="w-16 bg-transparent border rounded-xl h-20 text-center text-5xl"
        type="text"
        onKeyUp={(e) => handleKeyUp(e)}
        onChange={(e) =>
          setValue((prev) => [e.target.value, prev[1], prev[2], prev[3]])
        }
        value={value[0]}
        maxLength={1}
      />
      <input
        className="w-16 bg-transparent border rounded-xl h-20 text-center text-5xl"
        type="text"
        onKeyUp={(e) => handleKeyUp(e)}
        onChange={(e) =>
          setValue((prev) => [prev[0], e.target.value, prev[2], prev[3]])
        }
        value={value[1]}
        maxLength={1}
      />
      <input
        className="w-16 bg-transparent border rounded-xl h-20 text-center text-5xl"
        type="text"
        onKeyUp={(e) => handleKeyUp(e)}
        onChange={(e) =>
          setValue((prev) => [prev[0], prev[1], e.target.value, prev[3]])
        }
        value={value[2]}
        maxLength={1}
      />
      <input
        className="w-16 bg-transparent border rounded-xl h-20 text-center text-5xl"
        type="text"
        onKeyUp={(e) => {
          handleKeyUp(e);
        }}
        onChange={(e) =>
          setValue((prev) => [prev[0], prev[1], prev[2], e.target.value])
        }
        value={value[3]}
        maxLength={1}
      />
    </>
  );
};

export default CodeInput;
