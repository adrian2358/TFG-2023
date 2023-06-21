import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

import CategoryTypeSelector from "../../components/CategoryTypeSelector";
import Layout from "../../constants/Layout";
import { useTheme } from "../../theme/ThemeContext";
import { Category, CategoryType } from "../../data";
import { useDeleteCategory } from "../../hooks/category/useDeleteCategory";
import { useSaveCategory } from "../../hooks/category/useSaveCategory";
import { useModalStore } from "../../store/modalStore";
import { RootStackScreenProps } from "../../types";

type ScreenProps = RootStackScreenProps<"CategoryForm">;

export default function CategoryForm({ navigation, route }: ScreenProps) {
  const {
    theme: { colors },
  } = useTheme();
  const { mutateAsync: saveCategory } = useSaveCategory();
  const { mutateAsync: deleteCategory } = useDeleteCategory();
  const showSnackMessage = useModalStore((state) => state.showSnackMessage);

  const [name, setName] = useState(route.params?.name || "");
  const [icon, setIcon] = useState(route.params?.icon || "");
  const [type, setType] = useState(route.params?.type || CategoryType.expense);

  const handleSubmit = () => {
    const category = Category.create({
      id: route.params?.id,
      name,
      icon,
      type,
    });

    saveCategory(category)
      .then(() => {
        showSnackMessage({
          message: "Categoría creada correctamente",
          type: "success",
        });

        navigation.goBack();
      })
      .catch((err) => {
        showSnackMessage({
          message: "Algo salió mal, intente de nuevo",
          type: "error",
        });
        console.log("Failed to create Category!", err);
      });
  };

  const handleDelete = () => {
    deleteCategory(route.params!.id).then(() => {
      navigation.goBack();
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Text>Tipo:</Text>
          <CategoryTypeSelector value={type} onChange={setType} />
        </View>

        <View style={styles.inputGroup}>
          <Text>Nombre:</Text>
          <TextInput
            mode="outlined"
            value={name}
            onChangeText={(val) => setName(val)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text>Ícono:</Text>
          <View>
            <TextInput
              autoCapitalize="none"
              mode="outlined"
              value={icon}
              onChangeText={(val) => setIcon(val)}
            />
          </View>
          {icon.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <MaterialIcons name={icon as any} size={24} color={colors.text} />
            </View>
          )}
        </View>

        <Button
          mode="contained"
          style={{ marginTop: 24 }}
          disabled={!name || !icon}
          onPress={handleSubmit}
        >
          Guardar
        </Button>
        {route.params?.id && (
          <Button
            mode="contained"
            style={{ marginTop: 24 }}
            onPress={handleDelete}
          >
            Eliminar
          </Button>
        )}
      </View>
    </ScrollView>
  );
}

const screenWidth = Layout.window.width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  inputGroup: {
    flex: 1,
    // alignSelf: "center",
    paddingVertical: 16,
    alignContent: "center",
    width: screenWidth - 100,
  },
});
