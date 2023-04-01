import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Balance from "../components/Balance";
import ReportsPreview from "../components/reports/ReportsPreview";
import LastTransactions from "../components/transactions/LastTransactions";
import { useMainContext } from "../context/MainContext";
import ReportService from "../data/classes/Report";
import dataSource from "../data/data-source";
import { Category } from "../data/entities/Category";

export default function HomeScreen(props: {}) {
  const { balance, setBalance } = useMainContext();

  useEffect(() => {
    const reportService = new ReportService();
    reportService.getBalance().then(setBalance);

    // typeORM stuff
    // const categoryRepository = dataSource.getRepository(Category);
    // categoryRepository.find().then((res) => {
    //   console.log(JSON.stringify(res, undefined, 2));
    // });
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Balance balance={balance} />
        <View style={styles.smallSeparator} />
        <ReportsPreview />
        <View style={styles.smallSeparator} />
        <LastTransactions />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  smallSeparator: {
    marginVertical: 15,
  },
  footer: {
    justifyContent: "space-around",
    flexDirection: "row",
    marginTop: 32,
    width: "100%",
    bottom: 8,
    left: 0,
  },
});
