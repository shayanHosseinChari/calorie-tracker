import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

import { useTheme } from '@/shared/hooks/useTheme';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useToast } from '@/shared/ui/toast/ToastContext';
import { useFoodSearch } from '@/features/foods/hooks/useFoodSearch';
import { normalizeDigits } from '@/features/auth/utils/normalizeDigits';
import type { Food } from '@/features/foods/types';
import { useAddMeal } from '../hooks/useAddMeals';
import { useMeals } from '../hooks/useMeals';

type Colors = ReturnType<typeof useTheme>['colors'];
type AddMealRoute = RouteProp<any, 'AddMeal'>;

type SelectedItem =
  | { kind: 'food'; food: Food; amount: number }
  | { kind: 'custom'; name: string; calories: number; unit: string; amount: number };

const faNum = (n: number) => Math.round(n).toLocaleString('fa-IR');

export default function UpdateMealsScreen() {
  const t = useTheme();
  const colors = t.colors;
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<AddMealRoute>();
  const toast = useToast();

  const { meal } = route.params as any;
  const mealType: number =  meal?.id;
  const mealDate: string | undefined = meal?.date;

  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [customAmount, setCustomAmount] = useState('1');

  const { data: mealsData, isLoading: mealsLoading } = useMeals(mealDate);

  const currentMeal = useMemo(() => {
    if (!mealsData?.meals) return null;
    return (
      mealsData.meals.find(
        (m: any) => m.meal_id === mealType && (!mealDate || m.date === mealDate)
      ) ?? null
    );
  }, [mealsData, mealType, mealDate]);

  useEffect(() => {
    if (initialized) return;
    if (mealsLoading) return;
    if (!currentMeal) {
      setInitialized(true);
      return;
    }
    const foods: SelectedItem[] = (currentMeal.foods ?? []).map((f: any) => {
      if (f.food_id === 0) {
        return {
          kind: 'custom',
          name: f.food_name,
          calories: f.calories,
          unit: f.unit,
          amount: f.amount,
        };
      }
      return {
        kind: 'food',
        food: { id: f.food_id, name: f.food_name, calories: f.calories } as Food,
        amount: f.amount,
      };
    });
    setSelectedItems(foods);
    setInitialized(true);
  }, [currentMeal, mealsLoading, initialized]);

  useEffect(() => {
    setShowResults(debouncedQuery.trim().length > 0);
  }, [debouncedQuery]);

  const search = useFoodSearch(
    debouncedQuery,
    showResults && debouncedQuery.trim().length > 0
  );
  const addMeal = useAddMeal();
  const isSubmitting = addMeal.isPending;

  const isTyping = query !== debouncedQuery;
  const isSearching = (isTyping || search.isLoading) && showResults;
  const showEmpty =
    showResults &&
    !isSearching &&
    debouncedQuery.trim().length > 0 &&
    (search.data?.length ?? 0) === 0;

  const totalCalories = useMemo(
    () =>
      selectedItems.reduce((sum, item) => {
        const cal = item.kind === 'food' ? item.food.calories : item.calories;
        return sum + cal * item.amount;
      }, 0),
    [selectedItems]
  );

  const isFoodSelected = (foodId: number) =>
    selectedItems.some((i) => i.kind === 'food' && i.food.id === foodId);

  const getFoodAmount = (foodId: number) => {
    const item = selectedItems.find(
      (i) => i.kind === 'food' && i.food.id === foodId
    );
    return item ? item.amount : 0;
  };

  const addFood = (food: Food) => {
    setSelectedItems((prev) => {
      const existing = prev.findIndex(
        (i) => i.kind === 'food' && i.food.id === food.id
      );
      if (existing >= 0) {
        const next = [...prev];
        const item = next[existing] as Extract<SelectedItem, { kind: 'food' }>;
        next[existing] = { ...item, amount: item.amount + 1 };
        return next;
      }
      return [...prev, { kind: 'food', food, amount: 1 }];
    });
  };

  const addCustom = () => {
    const calories = Number(normalizeDigits(customCalories));
    const amount = Number(normalizeDigits(customAmount)) || 1;
    if (!customName.trim() || !calories || !customUnit.trim()) {
      toast.show('نام، کالری و واحد غذای دلخواه را پر کن.', { type: 'error' });
      return;
    }
    setSelectedItems((prev) => [
      ...prev,
      {
        kind: 'custom',
        name: customName.trim(),
        calories,
        unit: customUnit.trim(),
        amount,
      },
    ]);
    setCustomName('');
    setCustomCalories('');
    setCustomUnit('');
    setCustomAmount('1');
    setCustomOpen(false);
  };

  const removeItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAmount = (index: number, amount: number) => {
    if (amount <= 0) return;
    setSelectedItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], amount };
      return next;
    });
  };

  const onSubmit = async () => {
    if (selectedItems.length === 0) {
      toast.show('حداقل یک غذا انتخاب کن.', { type: 'error' });
      return;
    }

    const foods = selectedItems.map((item) =>
      item.kind === 'food'
        ? { food_id: item.food.id, amount: item.amount }
        : {
            food_id: 0,
            amount: item.amount,
            name: item.name,
            calories: item.calories,
            unit: item.unit,
          }
    );

    try {
      await addMeal.mutateAsync({
        meal_id: mealType as any,
        date: mealDate,
        foods,
      });
      toast.show('وعده با موفقیت ثبت شد.', { type: 'success' });
      navigation.goBack();
    } catch (e: any) {
      toast.show(e?.message ?? 'ثبت وعده انجام نشد.', { type: 'error' });
    }
  };

  if (mealsLoading && !initialized) {
    return (
      <View style={[styles.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.orange} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.headerIcon}
              hitSlop={10}
            >
              <MaterialDesignIcons name="arrow-right" size={22} color={colors.white} />
            </Pressable>
            <Text style={styles.headerTitle}>ثبت {meal?.title}</Text>
            <View style={{ width: 38 }} />
          </View>
          <Text style={styles.headerSubtitle}>
            {selectedItems.length > 0
              ? `${selectedItems.length.toLocaleString('fa-IR')} آیتم • ${faNum(totalCalories)} کالری`
              : 'چند غذا انتخاب کن یا غذای دلخواه وارد کن'}
          </Text>
        </View>

        <FlatList
          data={showResults ? search.data ?? [] : []}
          keyExtractor={(item) => String(item.id)}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
          ListHeaderComponent={
            <View style={styles.body}>
              <View style={styles.searchBox}>
                <MaterialDesignIcons name="magnify" size={20} color={colors.muted} />
                <TextInput
                  style={styles.searchInput}
                  value={query}
                  onChangeText={(v) => setQuery(v)}
                  placeholder="جستجوی غذا..."
                  placeholderTextColor={colors.muted}
                  editable={!isSubmitting}
                  returnKeyType="search"
                  onSubmitEditing={() => setShowResults(query.trim().length > 0)}
                />
                {query.length > 0 ? (
                  <Pressable
                    onPress={() => {
                      setQuery('');
                      setShowResults(false);
                    }}
                    hitSlop={8}
                  >
                    <MaterialDesignIcons name="close-circle" size={18} color={colors.muted} />
                  </Pressable>
                ) : null}
                {showResults ? (
                  <Pressable onPress={() => setShowResults(false)} hitSlop={8}>
                    <MaterialDesignIcons name="chevron-up" size={20} color={colors.muted} />
                  </Pressable>
                ) : null}
              </View>

              {isSearching ? (
                <View style={styles.center}>
                  <ActivityIndicator color={colors.orange} />
                </View>
              ) : null}

              {search.isError && showResults && !isTyping ? (
                <Text style={styles.errorText}>جستجو ناموفق بود.</Text>
              ) : null}

              {showEmpty ? (
                <Text style={styles.emptyText}>غذایی پیدا نشد.</Text>
              ) : null}
            </View>
          }
          renderItem={({ item }) => {
            const selected = isFoodSelected(item.id);
            const amount = getFoodAmount(item.id);
            return (
              <Pressable
                onPress={() => addFood(item)}
                style={({ pressed }) => [
                  styles.foodRow,
                  selected && styles.foodRowSelected,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <View style={[styles.foodIcon, selected && styles.foodIconSelected]}>
                  <MaterialDesignIcons
                    name={selected ? 'check' : 'food-apple-outline'}
                    size={20}
                    color={selected ? colors.white : colors.orange}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.foodName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.foodCal}>
                    {faNum(item.calories)} کالری
                    {selected && amount > 0 ? ` • ${faNum(amount)} عدد` : ''}
                  </Text>
                </View>
                {selected ? (
                  <View style={styles.selectedBadge}>
                    <MaterialDesignIcons name="check" size={14} color={colors.orange} />
                    <Text style={styles.selectedBadgeText}>{faNum(amount)}</Text>
                  </View>
                ) : (
                  <View style={styles.addSmall}>
                    <MaterialDesignIcons name="plus" size={18} color={colors.white} />
                  </View>
                )}
              </Pressable>
            );
          }}
          ListFooterComponent={
            <View style={styles.body}>
              <Pressable
                onPress={() => setCustomOpen((v) => !v)}
                style={styles.customHeader}
              >
                <View style={styles.customIcon}>
                  <MaterialDesignIcons
                    name={customOpen ? 'minus' : 'plus'}
                    size={18}
                    color={colors.orange}
                  />
                </View>
                <Text style={styles.customTitle}>غذای دلخواه</Text>
                <MaterialDesignIcons
                  name={customOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.muted}
                />
              </Pressable>

              {customOpen ? (
                <View style={styles.card}>
                  <Field
                    icon="food-outline"
                    placeholder="نام غذا"
                    value={customName}
                    onChangeText={setCustomName}
                    styles={styles}
                    colors={colors}
                    editable={!isSubmitting}
                  />
                  <Field
                    icon="fire"
                    placeholder="کالری (kcal)"
                    value={customCalories}
                    onChangeText={setCustomCalories}
                    keyboardType="numeric"
                    styles={styles}
                    colors={colors}
                    editable={!isSubmitting}
                  />
                  <Field
                    icon="scale"
                    placeholder="واحد (مثلاً کاسه، عدد)"
                    value={customUnit}
                    onChangeText={setCustomUnit}
                    styles={styles}
                    colors={colors}
                    editable={!isSubmitting}
                  />
                  <Field
                    icon="numeric"
                    placeholder="مقدار"
                    value={customAmount}
                    onChangeText={setCustomAmount}
                    keyboardType="numeric"
                    styles={styles}
                    colors={colors}
                    editable={!isSubmitting}
                  />
                  <Pressable
                    onPress={addCustom}
                    disabled={isSubmitting}
                    style={({ pressed }) => [
                      styles.addCustomBtn,
                      pressed && { opacity: 0.85 },
                    ]}
                  >
                    <MaterialDesignIcons name="plus" size={18} color={colors.white} />
                    <Text style={styles.addCustomText}>افزودن به وعده</Text>
                  </Pressable>
                </View>
              ) : null}

              {selectedItems.length > 0 ? (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>غذاهای انتخاب‌شده</Text>
                  {selectedItems.map((item, index) => {
                    const name = item.kind === 'food' ? item.food.name : item.name;
                    const cal =
                      item.kind === 'food' ? item.food.calories : item.calories;
                    return (
                      <View key={`${name}-${index}`} style={styles.selectedRow}>
                        <Pressable
                          onPress={() => removeItem(index)}
                          hitSlop={8}
                          style={styles.removeBtn}
                        >
                          <MaterialDesignIcons
                            name="close"
                            size={16}
                            color={colors.neutralIconActive}
                          />
                        </Pressable>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.selectedName} numberOfLines={1}>
                            {name}
                          </Text>
                          <Text style={styles.selectedCal}>
                            {faNum(cal * item.amount)} کالری
                          </Text>
                        </View>
                        <View style={styles.amountStepper}>
                          <Pressable
                            onPress={() =>
                              updateAmount(index, Math.max(0.5, item.amount - 0.5))
                            }
                            hitSlop={6}
                            style={styles.stepBtn}
                          >
                            <MaterialDesignIcons name="minus" size={14} color={colors.orange} />
                          </Pressable>
                          <Text style={styles.amountText}>{faNum(item.amount)}</Text>
                          <Pressable
                            onPress={() => updateAmount(index, item.amount + 0.5)}
                            hitSlop={6}
                            style={styles.stepBtn}
                          >
                            <MaterialDesignIcons name="plus" size={14} color={colors.orange} />
                          </Pressable>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}

              <Pressable
                onPress={onSubmit}
                disabled={isSubmitting || selectedItems.length === 0}
                style={({ pressed }) => [
                  styles.submitBtn,
                  (isSubmitting || selectedItems.length === 0) && { opacity: 0.5 },
                  pressed && { opacity: 0.85 },
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <>
                    <MaterialDesignIcons name="check" size={20} color={colors.white} />
                    <Text style={styles.submitText}>
                      ثبت وعده ({selectedItems.length.toLocaleString('fa-IR')})
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  styles,
  colors,
  editable,
}: {
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'numeric';
  styles: ReturnType<typeof createStyles>;
  colors: Colors;
  editable: boolean;
}) {
  return (
    <View style={styles.inputContainer}>
      <MaterialDesignIcons name={icon as any} size={18} color={colors.muted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.orange,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    headerRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    headerIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: 'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: { color: colors.white, fontSize: 17, fontFamily: 'vazir' },
    headerSubtitle: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: 12,
      fontFamily: 'vazir',
      textAlign: 'right',
      writingDirection: 'rtl',
      lineHeight: 20,
    },
    body: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },
    searchBox: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 8,
      backgroundColor: colors.white,
      borderRadius: 16,
      paddingHorizontal: 14,
      minHeight: 52,
      borderWidth: 1,
      borderColor: colors.greenTrack,
    },
    searchInput: {
      flex: 1,
      fontFamily: 'vazir',
      fontSize: 14,
      color: colors.text,
      textAlign: 'right',
      paddingVertical: 12,
    },
    center: { paddingVertical: 16, alignItems: 'center' },
    errorText: {
      fontFamily: 'vazir',
      fontSize: 12,
      color: colors.neutralIconActive,
      textAlign: 'center',
    },
    emptyText: {
      fontFamily: 'vazir',
      fontSize: 12,
      color: colors.muted,
      textAlign: 'center',
      paddingVertical: 12,
    },
    foodRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 10,
      marginHorizontal: 16,
      marginTop: 8,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.greenTrack,
      backgroundColor: colors.white,
    },
    foodRowSelected: {
      borderColor: colors.orange,
      backgroundColor: colors.peachSoft,
    },
    foodIcon: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    foodIconSelected: {
      backgroundColor: colors.orange,
    },
    foodName: {
      fontFamily: 'vazir',
      fontSize: 13,
      color: colors.text,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    foodCal: {
      fontFamily: 'vazir',
      fontSize: 10,
      color: colors.muted,
      textAlign: 'right',
      writingDirection: 'rtl',
      marginTop: 2,
    },
    addSmall: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.orange,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedBadge: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.orange,
    },
    selectedBadgeText: {
      fontFamily: 'vazir',
      fontSize: 11,
      color: colors.orange,
    },
    customHeader: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 10,
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.greenTrack,
      backgroundColor: colors.white,
    },
    customIcon: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.peachSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    customTitle: {
      flex: 1,
      fontFamily: 'vazir',
      fontSize: 13,
      color: colors.text,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 18,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.greenTrack,
      gap: 8,
    },
    cardTitle: {
      fontFamily: 'vazir',
      fontSize: 12,
      color: colors.muted,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    inputContainer: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 8,
      minHeight: 46,
      paddingHorizontal: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.greenTrack,
      backgroundColor: colors.background,
    },
    input: {
      flex: 1,
      fontFamily: 'vazir',
      fontSize: 14,
      color: colors.text,
      textAlign: 'right',
      paddingVertical: 10,
    },
    addCustomBtn: {
      minHeight: 44,
      borderRadius: 14,
      backgroundColor: colors.orange,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    addCustomText: { color: colors.white, fontFamily: 'vazir', fontSize: 13 },
    selectedRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.greenTrack,
    },
    removeBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: '#FDECEC',
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedName: {
      fontFamily: 'vazir',
      fontSize: 13,
      color: colors.text,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    selectedCal: {
      fontFamily: 'vazir',
      fontSize: 10,
      color: colors.muted,
      textAlign: 'right',
      writingDirection: 'rtl',
      marginTop: 2,
    },
    amountStepper: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: 6,
      paddingVertical: 4,
    },
    stepBtn: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    amountText: {
      fontFamily: 'vazir',
      fontSize: 12,
      color: colors.text,
      minWidth: 20,
      textAlign: 'center',
    },
    submitBtn: {
      minHeight: 54,
      backgroundColor: colors.orange,
      borderRadius: 18,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 4,
    },
    submitText: { color: colors.white, fontFamily: 'vazir', fontSize: 16 },
  });