
export function LedgerAccount() {
  return (target: Function) => {
    target.prototype.formatCode = formatCode
  }
}
