import RNDateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Layout from "../constants/Layout";
import { useMainContext } from "../context/MainContext";
import { useTheme } from "../context/ThemeContext";
import TransactionService from "../data/classes/Transaction";
import { RootTabParamList } from "../types";

type ScreenProps = NativeStackScreenProps<
  RootTabParamList,
  "TransactionForm" | "TransactionEditForm"
>;

export default function TransactionFormScreen({
  navigation,
  route,
}: ScreenProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const {
    transactions,
    selectedCategory,
    categories,
    selectCategory,
    setTransactions,
  } = useMainContext();
  const { themeType, theme } = useTheme();
  const transactionId = route.params?.transactionId;

  useEffect(() => {
    if (transactionId) {
      const transactionService = new TransactionService();
      transactionService.getById(transactionId).then((transaction) => {
        if (!transaction) {
          navigation.goBack();
          console.log(`Transaction with id ${transactionId} not found`);
        } else {
          setAmount(transaction.amount.toString());
          setDescription(transaction.description);
          selectCategory(
            categories.find((c) => c.id === transaction.category_id)!
          );
          setDate(dayjs(transaction.date).toDate());
        }
      });
    }
  }, [transactionId]);

  const datePicker =
    Platform.OS === "ios" ? (
      <RNDateTimePicker
        themeVariant={themeType}
        value={date}
        onChange={(e, newDate) => newDate && setDate(newDate)}
        style={{
          alignSelf: "flex-start",
        }}
      />
    ) : (
      <TouchableWithoutFeedback
        onPress={() => {
          DateTimePickerAndroid.open({
            value: date,
            onChange: (e, newDate) => {
              newDate && setDate(newDate);
            },
          });
        }}
      >
        <Text
          style={{
            borderColor: theme.colors.secondary,
            borderWidth: 1,
            borderRadius: 4,
            padding: 14,
          }}
        >
          {date.toDateString()}
        </Text>
      </TouchableWithoutFeedback>
    );

  const onSubmit = () => {
    const transactionService = new TransactionService();
    const transactionData = {
      date: date.toISOString().split("T")[0],
      description,
      amount: parseInt(amount, 10),
      category_id: selectedCategory!.id,
    };

    if (transactionId) {
      transactionService
        .update(transactionId, transactionData)
        .then(() => {
          navigation.goBack();
        })
        .catch((err) => {
          console.log(
            `Failed to update transaction with id: ${transactionId}`,
            err
          );
        });
    } else {
      transactionService
        .insert(transactionData)
        .then((newTransaction) => {
          setTransactions([newTransaction, ...transactions]);
          navigation.navigate("Home");
        })
        .catch((err) => {
          console.log(`\n\nQuery failed:\n${JSON.stringify(err)}\n\n`);
        });
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Text>Monto:</Text>
          <TextInput
            style={styles.input}
            mode="outlined"
            value={amount}
            onChangeText={(val) => setAmount(val)}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text>Descripción:</Text>
          <TextInput
            style={styles.input}
            mode="outlined"
            value={description}
            onChangeText={(val) => setDescription(val)}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text>Categoría:</Text>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("CategorySelect");
            }}
          >
            <Text
              style={{
                borderColor: theme.colors.secondary,
                borderWidth: 1,
                borderRadius: 4,
                padding: 14,
              }}
            >
              {!selectedCategory
                ? "Seleccionar categoría"
                : selectedCategory.name}
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.inputGroup}>
          <Text style={{ marginBottom: 8 }}>Fecha:</Text>
          {datePicker}
        </View>

        <Button
          mode="contained-tonal"
          style={{ marginTop: 24 }}
          disabled={!amount || !description || !selectedCategory}
          onPress={onSubmit}
        >
          Guardar
        </Button>
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
  input: {},
});