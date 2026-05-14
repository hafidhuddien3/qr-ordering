import { setLanguage } from '@/src/i18n';
import { useEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

export default function LanguageDropDown() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('en');
  const [items, setItems] = useState([
    { label: 'English', value: 'en' },
    { label: '中文', value: 'zh' },
  ]);

  useEffect(() => {
    setLanguage(value);
  }, [value]);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    />
  );
}