export type Area = {
  centers: { [code: string]: Center };
  offices: { [code: string]: Office };
  class10s: { [code: string]: Class10 };
  class15s: { [code: string]: Class15 };
  class20s: { [code: string]: Class20 };
};

export type Center = {
  name: string;
  enName: string;
  children: string[];
};

export type Office = Center & {
  parent: string;
  officeName: string;
};

export type Class10 = Center & {
  parent: string;
};

export type Class15 = Class10;

export type Class20 = Omit<Class10, 'children'> & {
  kana: string;
};
