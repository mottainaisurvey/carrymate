import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { trpc } from '../../../lib/trpc'

type Step = 1 | 2 | 3 | 4

interface ParcelForm {
  contents: string
  notes: string
  originCity: string
  originCode: string
  destCity: string
  destCode: string
  weightKg: string
  recipientName: string
  recipientPhone: string
  recipientAddress: string
}

const STEP_TITLES = ['Item Details', 'Route', 'Size & Weight', 'Review']

const LIVE_CORRIDORS = [
  { label: '🇬🇧 London → Lagos', originCity: 'London', originCode: 'LHR', destCity: 'Lagos', destCode: 'LOS' },
  { label: '🇬🇧 London → Accra', originCity: 'London', originCode: 'LHR', destCity: 'Accra', destCode: 'ACC' },
]

const COMING_SOON_CORRIDORS = [
  '🇺🇸 New York → Lagos (JFK → LOS)',
  '🇬🇧 London → Nairobi (LHR → NBO)',
  '🇫🇷 Paris → Abidjan (CDG → ABJ)',
  '🇬🇧 London → Kingston (LHR → KIN)',
]

export default function PostParcelScreen() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<ParcelForm>({
    contents: '',
    notes: '',
    originCity: '',
    originCode: '',
    destCity: '',
    destCode: '',
    weightKg: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
  })

  const createParcel = trpc.parcels.create.useMutation({
    onSuccess: () => {
      Alert.alert('Parcel posted!', 'Your parcel has been listed. Travelers will see it now.', [
        { text: 'View my parcels', onPress: () => router.replace('/(app)/(sender)/parcels') },
      ])
    },
    onError: (err: { message: string }) => Alert.alert('Error', err.message),
  })

  const set = (key: keyof ParcelForm, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }))

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!form.contents.trim()) { Alert.alert('Item description required'); return false }
    }
    if (step === 2) {
      if (!form.originCity.trim()) { Alert.alert('Origin city required'); return false }
      if (!form.originCode.trim()) { Alert.alert('Origin code required (e.g. LHR)'); return false }
      if (!form.destCity.trim()) { Alert.alert('Destination city required'); return false }
      if (!form.destCode.trim()) { Alert.alert('Destination code required (e.g. LOS)'); return false }
      if (!form.recipientName.trim()) { Alert.alert('Recipient name required'); return false }
      if (!form.recipientPhone.trim()) { Alert.alert('Recipient phone required'); return false }
    }
    if (step === 3) {
      if (!form.weightKg || isNaN(Number(form.weightKg))) { Alert.alert('Valid weight required'); return false }
    }
    return true
  }

  const handleNext = () => {
    if (!validateStep()) return
    if (step < 4) setStep((s) => (s + 1) as Step)
    else handleSubmit()
  }

  const handleSubmit = () => {
    createParcel.mutate({
      contents: form.contents,
      notes: form.notes || undefined,
      originCity: form.originCity,
      originCode: form.originCode.toUpperCase(),
      destCity: form.destCity,
      destCode: form.destCode.toUpperCase(),
      weightKg: parseFloat(form.weightKg),
      recipientName: form.recipientName,
      recipientPhone: form.recipientPhone,
      recipientAddress: form.recipientAddress || undefined,
    })
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Progress bar */}
      <View style={styles.progressBar}>
        {STEP_TITLES.map((title, i) => (
          <View key={i} style={styles.stepItem}>
            <View style={[styles.stepDot, i + 1 <= step && styles.stepDotActive]}>
              <Text style={[styles.stepNum, i + 1 <= step && styles.stepNumActive]}>
                {i + 1}
              </Text>
            </View>
            <Text style={[styles.stepLabel, i + 1 === step && styles.stepLabelActive]}>
              {title}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        {/* Step 1: Item Details */}
        {step === 1 && (
          <>
            <Text style={styles.sectionTitle}>What are you sending?</Text>
            <Text style={styles.label}>Item description *</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="e.g. iPhone 15 Pro, clothing, documents..."
              placeholderTextColor="#aaa"
              value={form.contents}
              onChangeText={(v) => set('contents', v)}
              multiline
              numberOfLines={3}
            />
            <Text style={styles.label}>Additional notes (optional)</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="e.g. Handle with care, no liquids..."
              placeholderTextColor="#aaa"
              value={form.notes}
              onChangeText={(v) => set('notes', v)}
              multiline
              numberOfLines={2}
            />
          </>
        )}

        {/* Step 2: Route */}
        {step === 2 && (
          <>
            <Text style={styles.sectionTitle}>Where is it going?</Text>
            <Text style={styles.label}>Select a corridor *</Text>
            {LIVE_CORRIDORS.map((c) => {
              const isSelected = form.originCode === c.originCode && form.destCode === c.destCode
              return (
                <TouchableOpacity
                  key={c.destCode}
                  style={[styles.corridorBtn, isSelected && styles.corridorBtnActive]}
                  onPress={() => setForm((prev) => ({ ...prev, originCity: c.originCity, originCode: c.originCode, destCity: c.destCity, destCode: c.destCode }))}
                >
                  <Text style={[styles.corridorBtnText, isSelected && styles.corridorBtnTextActive]}>{c.label}</Text>
                  {isSelected && <Text style={styles.corridorCheck}>✓</Text>}
                </TouchableOpacity>
              )
            })}
            <View style={styles.comingSoonBox}>
              <Text style={styles.comingSoonTitle}>Coming in 2026</Text>
              {COMING_SOON_CORRIDORS.map((r) => (
                <Text key={r} style={styles.comingSoonItem}>{r}</Text>
              ))}
            </View>
            <Text style={styles.label}>Recipient name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Full name of recipient"
              placeholderTextColor="#aaa"
              value={form.recipientName}
              onChangeText={(v) => set('recipientName', v)}
              autoCapitalize="words"
            />
            <Text style={styles.label}>Recipient phone *</Text>
            <TextInput
              style={styles.input}
              placeholder="+234 801 234 5678"
              placeholderTextColor="#aaa"
              value={form.recipientPhone}
              onChangeText={(v) => set('recipientPhone', v)}
              keyboardType="phone-pad"
            />
            <Text style={styles.label}>Recipient address (optional)</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Delivery address"
              placeholderTextColor="#aaa"
              value={form.recipientAddress}
              onChangeText={(v) => set('recipientAddress', v)}
              multiline
            />
          </>
        )}

        {/* Step 3: Weight */}
        {step === 3 && (
          <>
            <Text style={styles.sectionTitle}>Weight</Text>
            <Text style={styles.label}>Weight (kg) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2.5"
              placeholderTextColor="#aaa"
              value={form.weightKg}
              onChangeText={(v) => set('weightKg', v)}
              keyboardType="decimal-pad"
            />
            <View style={styles.priceHint}>
              <Text style={styles.priceHintText}>
                💡 Travelers set their own price per kg. Once matched, you'll see the total cost.
              </Text>
            </View>
          </>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <>
            <Text style={styles.sectionTitle}>Review your listing</Text>
            <View style={styles.reviewCard}>
              <ReviewRow label="Contents" value={form.contents} />
              {form.notes ? <ReviewRow label="Notes" value={form.notes} /> : null}
              <ReviewRow label="Route" value={`${form.originCity} (${form.originCode}) → ${form.destCity} (${form.destCode})`} />
              <ReviewRow label="Recipient" value={`${form.recipientName} · ${form.recipientPhone}`} />
              <ReviewRow label="Weight" value={`${form.weightKg} kg`} highlight />
            </View>
          </>
        )}
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.footer}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setStep((s) => (s - 1) as Step)}
          >
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, createParcel.isPending && styles.btnDisabled, step === 1 && styles.nextBtnFull]}
          onPress={handleNext}
          disabled={createParcel.isPending}
        >
          {createParcel.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextBtnText}>
              {step === 4 ? 'Post Parcel' : 'Next'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

function ReviewRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={[styles.reviewValue, highlight && styles.reviewValueHighlight]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  stepItem: { alignItems: 'center', flex: 1 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepDotActive: { backgroundColor: '#1D7A5F' },
  stepNum: { fontSize: 12, fontWeight: '700', color: '#999' },
  stepNumActive: { color: '#fff' },
  stepLabel: { fontSize: 10, color: '#aaa', textAlign: 'center' },
  stepLabelActive: { color: '#1D7A5F', fontWeight: '600' },
  inner: { padding: 24, paddingBottom: 40 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 4 },
  input: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  priceHint: {
    backgroundColor: '#fffbeb',
    borderRadius: 10,
    padding: 14,
    marginTop: 4,
  },
  priceHintText: { fontSize: 13, color: '#92400e', lineHeight: 18 },
  reviewCard: {
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 14,
    overflow: 'hidden',
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  reviewLabel: { fontSize: 13, color: '#888', flex: 1 },
  reviewValue: { fontSize: 14, color: '#1a1a1a', fontWeight: '500', flex: 2, textAlign: 'right' },
  reviewValueHighlight: { color: '#1D7A5F', fontWeight: '700', fontSize: 16 },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backBtnText: { fontSize: 15, color: '#555', fontWeight: '600' },
  nextBtn: {
    flex: 2,
    backgroundColor: '#1D7A5F',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextBtnFull: { flex: 1 },
  btnDisabled: { opacity: 0.6 },
  nextBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  corridorBtn: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  corridorBtnActive: { borderColor: '#1D7A5F', backgroundColor: '#f0fdf4' },
  corridorBtnText: { fontSize: 15, color: '#333', fontWeight: '500' },
  corridorBtnTextActive: { color: '#1D7A5F', fontWeight: '700' },
  corridorCheck: { fontSize: 16, color: '#1D7A5F', fontWeight: '700' },
  comingSoonBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    marginTop: 4,
  },
  comingSoonTitle: { fontSize: 12, fontWeight: '700', color: '#aaa', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  comingSoonItem: { fontSize: 13, color: '#bbb', marginBottom: 4 },
})
