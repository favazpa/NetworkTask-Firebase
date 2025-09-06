import React from "react";
import { Platform, Text, View, StyleSheet, I18nManager } from "react-native";
import colors from "../../theme/colors";

export const commonHeaderOptions = {
  headerStyle: { backgroundColor: colors.bg },
  headerShadowVisible: false,
  headerTintColor: colors.text,
  headerBackTitleVisible: false,
  headerTitleAlign: "center" as const,
  headerTitle: ({ children }: any) => (
    <View style={styles.titleWrap}>
      <Text numberOfLines={1} style={[styles.title, I18nManager.isRTL && styles.titleRTL]}>
        {children}
      </Text>
    </View>
  ),
};

export const largeTitleOptions =
  Platform.OS === "ios"
    ? ({
        headerLargeTitle: true,
        headerLargeTitleStyle: { color: colors.text, fontWeight: "800" },
      } as const)
    : ({} as const);

const styles = StyleSheet.create({
  titleWrap: { alignItems: "center", justifyContent: "center" },
  title: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.2,
  },
  titleRTL: {
    textAlign: "right",
  },
});
