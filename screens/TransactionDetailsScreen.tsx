import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  List,
  Paragraph,
  Portal,
  Text,
} from "react-native-paper";
import { useMainContext } from "../context/MainContext";
import { useTheme } from "../context/ThemeContext";
import { BudgetStatus } from "../data/classes/Budget";
import { CategoryType } from "../data/classes/Category";
import TransactionService, { Transaction } from "../data/classes/Transaction";
import { RootTabParamList } from "../types";

type ScreenProps = NativeStackScreenProps<
  RootTabParamList,
  "TransactionDetails"
>;

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

export default function TransactionDetailsScreen({
  navigation,
  route,
}: ScreenProps) {
  const [transaction, setTransaction] = useState<Transaction>();
  const [dialogVisible, setDialogVisible] = useState(false);
  const { categories, activeBudgets } = useMainContext();
  const {
    theme: { colors },
  } = useTheme();
  const category = categories.find((c) => c.id === transaction?.category_id);
  const budgets = activeBudgets.filter(
    (b) => b.category_id === category?.id && b.is_active
  );

  useEffect(() => {
    const transactionService = new TransactionService();
    transactionService.getById(route.params.transactionId).then((t) => {
      if (!t) {
        console.log(`Transaction not found!!!`);
        navigation.goBack();
      } else {
        setTransaction(t);
      }
    });
  }, []);

  const themedStyles = StyleSheet.create({
    bordered: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
  });

  const deleteTransaction = () => {
    const transactionService = new TransactionService();
    transactionService.delete(route.params.transactionId).then((deleted) => {
      if (deleted) {
        navigation.goBack();
      } else {
        console.log("Failed to delete transaction");
      }
    });
  };

  if (!transaction || !category) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.transactionInfo, themedStyles.bordered]}>
        <View style={styles.header}>
          <MaterialIcons
            name={category.icon.toLowerCase() as MaterialIconName}
            color={colors.text}
            size={24}
          />
          <Text style={styles.ms2} variant="titleLarge">
            {category?.name}
          </Text>
        </View>

        <View style={styles.amount}>
          <Text
            variant="headlineSmall"
            style={{
              color:
                category.type === CategoryType.expense
                  ? colors.expenseColor
                  : colors.incomeColor,
            }}
          >
            Gs. {transaction.amount.toLocaleString()}
          </Text>
        </View>

        <View style={styles.description}>
          <MaterialIcons name="short-text" size={24} color={colors.text} />
          <Text variant="bodyLarge" style={styles.ms2}>
            {transaction.description}
          </Text>
        </View>

        <View style={styles.description}>
          <MaterialIcons name="calendar-today" size={24} color={colors.text} />
          <Text variant="bodyLarge" style={styles.ms2}>
            {transaction.date}
          </Text>
        </View>

        <View style={styles.description}>
          <Button
            onPress={() => {
              navigation.navigate("TransactionEditForm", {
                transactionId: transaction.id,
              });
            }}
            mode="contained-tonal"
            icon="pencil"
          >
            Editar
          </Button>
          <Button
            onPress={() => {
              setDialogVisible(true);
            }}
            style={styles.ms2}
            mode="contained-tonal"
            icon="delete"
          >
            Eliminar
          </Button>
        </View>
      </View>

      <View style={styles.budgetInfo}>
        <Text style={[styles.ms2, styles.mb2]} variant="titleMedium">
          Presupuestos:
        </Text>
        {budgets.length > 0 ? (
          budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              onPress={() => {
                navigation.navigate("BudgetDetails", {
                  budgetId: b.id,
                });
              }}
            />
          ))
        ) : (
          <Text style={{ padding: 16 }}>
            Esta categoría no pertenece a ningún presupuesto.
          </Text>
        )}
      </View>

      <DeleteDialog
        onDelete={deleteTransaction}
        visible={dialogVisible}
        hideDialog={() => setDialogVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transactionInfo: {
    paddingVertical: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  ms2: {
    marginStart: 16,
  },
  mb2: {
    marginBottom: 16,
  },
  amount: {
    marginTop: 16,
    marginStart: 32,
  },
  description: {
    flexDirection: "row",
    marginTop: 16,
    marginStart: 32,
  },
  budgetInfo: {
    marginTop: 16,
  },
  budgetCard: {
    marginTop: 16,
  },
});

type BudgetCardProps = {
  budget: BudgetStatus;
  onPress(): void;
};

function BudgetCard({ budget, onPress }: BudgetCardProps) {
  const {
    theme: { colors },
  } = useTheme();

  const themedStyles = {
    budgetItem: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.onSecondary,
    },
  };

  return (
    <List.Item
      key={budget.id}
      onPress={onPress}
      title={budget.description}
      description={`${budget.start_date} al ${budget.end_date}`
        .replaceAll("2022-", "")
        .replaceAll("-", "/")}
      descriptionStyle={{ marginTop: 4 }}
      right={() => {
        return (
          <Text>
            {`${budget.transactionsTotal.toLocaleString()} / ${budget.max_amount.toLocaleString()}`}
          </Text>
        );
      }}
      style={themedStyles.budgetItem}
    />
  );
}

type DialogProps = {
  visible: boolean;
  hideDialog(): void;
  onDelete(): void;
};

function DeleteDialog({ visible, hideDialog, onDelete }: DialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Paragraph>Está seguro que quiere eliminar este elemento?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              hideDialog();
            }}
          >
            Cancelar
          </Button>
          <Button
            onPress={() => {
              hideDialog();
              onDelete();
            }}
          >
            Eliminar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}