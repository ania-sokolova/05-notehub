interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBox = ({ value, onChange }: SearchBoxProps) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search notes"
    />
  );
};

export default SearchBox;