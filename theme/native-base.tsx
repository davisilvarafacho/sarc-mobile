import { Platform } from "react-native";
import { extendTheme } from "native-base";
import { color } from "native-base/lib/typescript/theme/styled-system";

export function mode(light: any, dark: any) {
  return (props: any) => (props.colorMode === "dark" ? dark : light);
}

export const theme = extendTheme({
  // colors: {
  //   error: {
  //     50: "#5F2568",
  //     100: "#5F2568",
  //     200: "#5F2568",
  //     300: "#5F2568",
  //     400: "#5F2568",
  //     500: "#5F2568",
  //     600: "#5F2568",
  //     700: "#5F2568",
  //     800: "#5F2568",
  //     900: "#5F2568",
  //   },
  // },
  fontConfig: {
    Alliance: {
      100: {
        normal: "Alliance",
        italic: "Alliance",
      },
      200: {
        normal: "Alliance",
        italic: "Alliance",
      },
      300: {
        normal: "Alliance",
        italic: "Alliance",
      },
      400: {
        normal: "Alliance",
        italic: "Alliance",
      },
      500: {
        normal: "Alliance",
        italic: "Alliance",
      },
    },
  },
  fonts: {
    heading: "Alliance",
    body: "Alliance",
    mono: "Alliance",
  },

  components: {
    Heading: {
      defaultProps: {
        size: "2xl",
        fontFamily: "Alliance",
        fontWeight: "400",
      },
    },
    Text: {
      defaultProps: {
        fontFamily: "Alliance",
        fontWeight: "400",
      },
    },
    Input: {
      defaultProps: {
        fontSize: "md",
        fontFamily: "Lexend",
        bg: "white",
        // focusOutlineColor: "transparent",
        _stack: { style: {} },
        _focus: {
          bg: "#e6efed",
        },
      },
      baseStyle: (props: Record<string, any>) => {
        const { primary } = props.theme.colors;
        // Todo: Resolve boxShadow Color or Provide some alternatiove prop for user to change focusRing color
        // Todo: Update to support similar focusRing on iOS , Android and Web
        const focusRing =
          Platform.OS === "web"
            ? {
                boxShadow:
                  props.variant !== "underlined"
                    ? `${primary[400]} 0px 0px 0px 1px`
                    : `${primary[400]} 0px 1px 0px 0px`,
                zIndex: 1,
              }
            : {
                // boxShadow: `${useToken('colors', ['primary.400'])} 0px 0px 0px 1px`,
              };

        return {
          fontFamily: "body",
          px: 4,
          py: 2,
          borderRadius: "lg",
          color: mode("black", "white")(props),
          placeholderTextColor: mode("muted.400", "muted.500")(props),
          background: "transparent",
          borderColor: mode("muted.200", "muted.600")(props),
          _disabled: {
            opacity: 0.8,
            bg: mode("muted.100", "muted.700")(props),
          },
          _hover: {
            borderColor: mode("muted.300", "muted.500")(props),
          },
          _invalid: {
            borderColor: mode("error.600", "error.200")(props),
          },
          _focus: {
            style: { ...focusRing },
            borderColor: "#03624C",
          },
          _android: {
            px: 4,
            py: 3,
            _focus: {
              borderColor: "#03624C",
            },
          },
          _ios: {
            px: 4,
            py: 3,
            _focus: {
              borderColor: "#03624C",
            },
          },
        };
      },
    },
    Switch: {
      defaultProps: {
        onTrackColor: "#03624C",
      },
    },
    Button: {
      defaultProps: {
        // bg: "#03624C",
        _text: {
          fontFamily: "body",
        },
        _pressed: {
          bg: ({ variant }: { variant?: string }) =>
            variant === "ghost" || variant === "link"
              ? "rgba(3, 98, 76, 0.2)"
              : variant === "outline"
              ? "rgba(3, 98, 76, 0.1)"
              : variant === "solid"
              ? "#024535"
              : variant === "subtle"
              ? "rgba(3, 98, 76, 0.3)"
              : "#03624C",
        },
      },
      variants: {
        ghost: {
          _text: { color: "#03624C" },
          _hover: { bg: "rgba(3, 98, 76, 0.1)" },
          _pressed: { bg: "rgba(3, 98, 76, 0.2)" },
        },
        link: {
          _text: { color: "#03624C", textDecoration: "underline" },
          _hover: { textDecoration: "none", _text: { color: "#024535" } },
          _pressed: { _text: { color: "#024535" } },
        },
        outline: {
          borderColor: "#03624C",
          borderWidth: 1,
          _text: { color: "#03624C" },
          _hover: { bg: "rgba(3, 98, 76, 0.1)" },
          _pressed: { bg: "rgba(3, 98, 76, 0.2)" },
        },
        solid: {
          bg: "#03624C",
          _text: { color: "white" },
          _hover: { bg: "#024e3d" },
          _pressed: { bg: "#024535" },
        },
        subtle: {
          bg: "rgba(3, 98, 76, 0.1)",
          _text: { color: "#03624C" },
          _hover: { bg: "rgba(3, 98, 76, 0.2)" },
          _pressed: { bg: "rgba(3, 98, 76, 0.3)" },
        },
      },
    },
    /* Button: {
      defaultProps: {
        bg: "#03624C",
        _text: {
          fontFamily: "body",
        },
        _pressed: {
          // bg: "#024e3d"
          // bg: ({ variant }: { variant?: string }) => "#024e3d"
              
          bg: ({ variant }: { variant?: string }) =>
            variant === "ghost"
              ? "transparent" : variant === "filled"
              ? "#024535": "#03624C",
        },
      },
    }, */
  },
});
