interface ImportMetaEnv {
  /** Contact form endpoint (Formspree, Web3Forms, Basin…). Empty = show email instead of the form. */
  readonly PUBLIC_FORM_ENDPOINT?: string;
  /** Optional access key, sent as `access_key` (required by Web3Forms). */
  readonly PUBLIC_FORM_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
