import type { Theme } from "@react-navigation/native";
import colors from "./colors";

const navTheme: Theme = {
  dark: true,
  colors: {
    primary: colors.accent,
    background: colors.bg,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    notification: colors.accentAlt,
  },
};

export default navTheme;
