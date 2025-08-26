declare module 'react-katex' {
  import { FC, ReactNode } from 'react';

  interface KaTeXProps {
    children?: ReactNode;
    math?: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error | TypeError) => ReactNode;
    settings?: {
      displayMode?: boolean;
      throwOnError?: boolean;
      errorColor?: string;
      strict?: boolean | string;
      trust?: boolean;
      macros?: Record<string, string>;
    };
  }

  export const InlineMath: FC<KaTeXProps>;
  export const BlockMath: FC<KaTeXProps>;
}