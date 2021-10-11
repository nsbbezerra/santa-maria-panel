import { theme, extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  ...theme,
  breakpoints: ["30em", "48em", "52em", "62em", "80em"],
  fonts: {
    body: "Urbanist, sans-serif",
    heading: "Urbanist, sans-serif",
    mono: "Urbanist, sans-serif",
  },
  fontWeights: {
    ...theme.fontWeights,
    normal: 400,
    medium: 500,
    bold: 700,
  },
  colors: {
    ...theme.colors,
    green: {
      100: "#c7e8c4",
      200: "#abdca8",
      300: "#8ed08b",
      400: "#6fc46f",
      500: "#4BB753",
      600: "#419646",
      700: "#367639",
      800: "#2b582c",
      900: "#203b20",
    },
    blue: {
      100: "#bfc3db",
      200: "#a0a7c9",
      300: "#808bb7",
      400: "#6070a5",
      500: "#3d5794",
      600: "#35487a",
      700: "#2c3a60",
      800: "#242d48",
      900: "#1b2031",
    },
  },
  components: {
    Button: {
      baseStyle: {
        _focus: { boxShadow: "none" },
      },
    },
    CloseButton: {
      baseStyle: { _focus: { boxShadow: "none" } },
    },
    Checkbox: {
      baseStyle: { control: { _focus: { boxShadow: "none" } } },
    },
    Radio: {
      baseStyle: { control: { _focus: { boxShadow: "none" } } },
    },
    Menu: {
      baseStyle: {
        list: {
          boxShadow: "lg",
          borderWidth: "2px",
          borderColor: "blue.400",
        },
        item: {
          _hover: { bg: "blue.500", color: "white" },
          _focus: { bg: "blue.500", color: "white" },
        },
      },
    },
  },
});

export { customTheme };
