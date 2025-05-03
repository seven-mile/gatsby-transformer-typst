interface OptionSchema {
  domScale: number;
}

let optionStore: OptionSchema = {
  domScale: 1,
};

export function getOptionValue<K extends keyof OptionSchema>(
  key: K,
): OptionSchema[K] {
  return optionStore[key];
}

export function setOptionValue<K extends keyof OptionSchema>(
  key: K,
  value: OptionSchema[K]
) {
  optionStore[key] = value;
}
