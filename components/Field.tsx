type Props = {
  label: string | JSX.Element
  children: JSX.Element
}

function Field({ label, children }: Props) {
  return (
    <label>
      <span>{label}</span>
      {children}
    </label>
  )
}

export default Field
