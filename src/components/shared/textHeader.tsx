type TextHeaderProps = {
  children: React.ReactNode;
}

function TextHeader({children}: TextHeaderProps) {
  return <div className="text-4xl">{children}</div>;
}

export default TextHeader;