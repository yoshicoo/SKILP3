declare module 'pdf-parse' {
  interface PdfData {
    text: string
    [key: string]: unknown
  }
  function pdfParse(buffer: Buffer | Uint8Array, options?: unknown): Promise<PdfData>
  export default pdfParse
}
