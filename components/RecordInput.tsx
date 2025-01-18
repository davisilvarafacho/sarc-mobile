import { useState, useEffect } from "react";
import {
  Box,
  Pressable,
  Menu,
  HamburgerIcon,
  Input,
  type IInputProps,
} from "native-base";
import { useQuery } from "@tanstack/react-query";

import { useApi } from "@/hooks/useApi";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
type RecordInputConfig = {
  modulo: string;
  endpoint: BackendEndpoint;
  searchField: string;
  displayField: string;
};

const modulos: RecordInputConfig[] = [
  {
    modulo: "lugares",
    endpoint: "lugares",
    searchField: "nome",
    displayField: "nome",
  },
] as const;

type Props = {
  modulo: string;
  onSubmitCallback: (data: any) => void;
};

export function RecordInput(props: Props) {
  const moduloConfig = modulos.find(
    (m) => m.modulo === props.modulo
  ) as RecordInputConfig;

  const { sendGetList } = useApi("eventos");

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isSuccess } = useQuery({
    queryKey: [props.modulo],
    queryFn: () => sendGetList({ [moduloConfig.searchField]: debouncedSearch }),
  });

  return (
    <Box w="full" alignItems="center">
      <Menu
        w="310"
        trigger={(triggerProps) => {
          return (
            <Input
              w="full"
              placeholder="Buscar"
              value={search}
              onChangeText={setSearch}
              {...triggerProps}
            />
          );
        }}
      >
        {isSuccess &&
          data.resultados.map((item) => (
            <Menu.Item
              key={item.id}
              onPress={() => props.onSubmitCallback(item)}
            >
              {item[moduloConfig.displayField]}
            </Menu.Item>
          ))}
      </Menu>
    </Box>
  );
}
