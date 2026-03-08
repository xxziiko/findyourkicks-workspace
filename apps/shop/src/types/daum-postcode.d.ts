interface DaumPostcodeData {
  zonecode: string;
  roadAddress: string;
  bname: string;
  buildingName: string;
  apartment: string;
  autoRoadAddress: string;
  autoJibunAddress: string;
}

interface DaumPostcodeOptions {
  oncomplete: (data: DaumPostcodeData) => void;
  width?: string | number;
  height?: string | number;
  theme?: Record<string, string>;
}

declare namespace daum {
  class Postcode {
    constructor(options: DaumPostcodeOptions);
    embed(element: HTMLElement): void;
    open(): void;
  }
}

declare interface Window {
  daum: typeof daum;
}
