import { useIsFocused } from "@react-navigation/native";
import dayjs from "dayjs";
import { useState } from "react";
import { FAB, Portal } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

import { DATE_FORMAT, DateRange, getDatesFromRange } from "../utils/dateUtils";

type DateFilterFABProps = {
  initialRange?: DateRange;
  onChange(dateRange: DateRange): void;
};

export default function DateFilterFAB({
  initialRange,
  onChange,
}: DateFilterFABProps) {
  const isFocused = useIsFocused();

  const [open, setOpen] = useState(false);
  const [openDateModal, setOpenDateModal] = useState(false);
  const [range, setRange] = useState(initialRange || getDatesFromRange("week"));

  if (!isFocused) {
    return null;
  }

  return (
    <>
      <Portal>
        <FAB.Group
          visible
          open={open}
          style={{
            bottom: 85,
            right: 5,
          }}
          fabStyle={{
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
          icon="calendar-today"
          actions={[
            {
              icon: "calendar-range",
              label: "Esta semana",
              onPress: () => {
                const newRange = getDatesFromRange("week");
                onChange(newRange);
                setRange(newRange);
              },
            },
            {
              icon: "calendar-month",
              label: "Este mes",
              onPress: () => {
                const newRange = getDatesFromRange("month");
                onChange(newRange);
                setRange(newRange);
              },
            },
            {
              icon: "calendar-edit",
              label: "Personalizar",
              onPress: () => {
                setOpen(false);
                setOpenDateModal(true);
              },
            },
          ]}
          onStateChange={({ open }) => setOpen(open)}
        />
      </Portal>
      <DatePickerModal
        locale="en"
        mode="range"
        visible={openDateModal}
        onDismiss={() => setOpenDateModal(false)}
        startDate={dayjs(range.startDate).toDate()}
        endDate={dayjs(range.endDate).toDate()}
        onConfirm={(range) => {
          setOpenDateModal(false);
          const { startDate, endDate } = range;
          if (startDate !== undefined && endDate !== undefined) {
            const newRange = {
              startDate: dayjs(startDate).format(DATE_FORMAT),
              endDate: dayjs(endDate).format(DATE_FORMAT),
            };
            onChange(newRange);
            setRange(newRange);
          }
        }}
        dateMode="start"
      />
    </>
  );
}