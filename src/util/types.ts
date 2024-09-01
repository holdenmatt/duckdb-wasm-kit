type JSONPrimitive = string | number | boolean | null;

type JSONValue =
  | JSONPrimitive
  | readonly JSONValue[]
  | {
      [key: string]: JSONValue;
    };

export type JSONObject = Record<string, JSONValue>;
