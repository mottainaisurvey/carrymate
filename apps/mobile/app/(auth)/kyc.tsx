import { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from 'react-native'
import { useRouter } from 'expo-router'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'
import { trpc } from '../../lib/trpc'

type IdType = 'passport' | 'national_id' | 'drivers_license'

const ID_TYPES: { id: IdType; label: string; emoji: string }[] = [
  { id: 'passport', label: 'Passport', emoji: '🛂' },
  { id: 'national_id', label: 'National ID', emoji: '🪪' },
  { id: 'drivers_license', label: "Driver's Licence", emoji: '🚗' },
]

export default function KycScreen() {
  const [idType, setIdType] = useState<IdType | null>(null)
  const [idNumber, setIdNumber] = useState('')
  const [selfieUri, setSelfieUri] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [permission, requestPermission] = useCameraPermissions()
  const cameraRef = useRef<CameraView>(null)
  const router = useRouter()

  const initKyc = trpc.users.initKYC.useMutation({
    onSuccess: () => {
      router.replace('/(app)/dashboard')
    },
    onError: (err) => {
      Alert.alert('KYC Error', err.message)
    },
  })

  const takeSelfie = async () => {
    if (!permission?.granted) {
      const result = await requestPermission()
      if (!result.granted) {
        Alert.alert(
          'Camera permission required',
          'Please allow camera access to take a selfie.'
        )
        return
      }
    }
    setShowCamera(true)
  }

  const captureSelfie = async () => {
    if (!cameraRef.current) return
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 })
    if (photo) {
      setSelfieUri(photo.uri)
      setShowCamera(false)
    }
  }

  const handleSubmit = () => {
    if (!idType) {
      Alert.alert('Select ID type', 'Please choose your ID document type.')
      return
    }
    if (!idNumber.trim()) {
      Alert.alert('ID number required', 'Please enter your ID number.')
      return
    }
    if (!selfieUri) {
      Alert.alert('Selfie required', 'Please take a selfie for identity verification.')
      return
    }

    initKyc.mutate({
      idType,
      idNumber: idNumber.trim(),
      selfieUri,
    })
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing="front">
          <View style={styles.cameraOverlay}>
            <View style={styles.faceGuide} />
            <Text style={styles.cameraHint}>
              Position your face within the circle
            </Text>
            <TouchableOpacity style={styles.captureBtn} onPress={captureSelfie}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelCamera}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.cancelCameraText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.heading}>Verify your identity</Text>
      <Text style={styles.sub}>
        KYC verification is required to send or carry parcels. Your data is
        encrypted and secure.
      </Text>

      {/* ID Type */}
      <Text style={styles.label}>Document type</Text>
      <View style={styles.idGrid}>
        {ID_TYPES.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.idCard, idType === t.id && styles.idCardActive]}
            onPress={() => setIdType(t.id)}
          >
            <Text style={styles.idEmoji}>{t.emoji}</Text>
            <Text style={[styles.idLabel, idType === t.id && styles.idLabelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ID Number */}
      <Text style={styles.label}>Document number</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. A12345678"
        placeholderTextColor="#aaa"
        value={idNumber}
        onChangeText={setIdNumber}
        autoCapitalize="characters"
      />

      {/* Selfie */}
      <Text style={styles.label}>Selfie</Text>
      {selfieUri ? (
        <View style={styles.selfiePreview}>
          <Image source={{ uri: selfieUri }} style={styles.selfieImg} />
          <TouchableOpacity style={styles.retakeBtn} onPress={takeSelfie}>
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.selfieBtn} onPress={takeSelfie}>
          <Text style={styles.selfieEmoji}>🤳</Text>
          <Text style={styles.selfieBtnText}>Take a selfie</Text>
          <Text style={styles.selfieHint}>Hold your phone at eye level</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.btn, initKyc.isPending && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={initKyc.isPending}
      >
        {initKyc.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Submit for Verification</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Verification usually takes 1–2 hours. You'll receive a notification once
        approved.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 24, paddingTop: 32, paddingBottom: 60 },
  heading: { fontSize: 26, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  sub: { fontSize: 15, color: '#666', marginBottom: 28, lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10, marginTop: 4 },
  idGrid: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  idCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  idCardActive: { borderColor: '#1D7A5F', backgroundColor: '#f0faf7' },
  idEmoji: { fontSize: 26, marginBottom: 6 },
  idLabel: { fontSize: 12, fontWeight: '600', color: '#555', textAlign: 'center' },
  idLabelActive: { color: '#1D7A5F' },
  input: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 24,
  },
  selfieBtn: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 14,
    borderStyle: 'dashed',
    padding: 28,
    alignItems: 'center',
    marginBottom: 28,
    backgroundColor: '#fafafa',
  },
  selfieEmoji: { fontSize: 40, marginBottom: 8 },
  selfieBtnText: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  selfieHint: { fontSize: 13, color: '#888' },
  selfiePreview: { marginBottom: 28, alignItems: 'center' },
  selfieImg: { width: 160, height: 160, borderRadius: 80, marginBottom: 12 },
  retakeBtn: {
    borderWidth: 1,
    borderColor: '#1D7A5F',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  retakeText: { color: '#1D7A5F', fontWeight: '600' },
  btn: {
    backgroundColor: '#1D7A5F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  disclaimer: { fontSize: 13, color: '#999', textAlign: 'center', lineHeight: 18 },
  // Camera
  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  cameraOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 60,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  faceGuide: {
    width: 220,
    height: 280,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
    top: '15%',
  },
  cameraHint: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 32,
    textAlign: 'center',
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
  cancelCamera: { padding: 12 },
  cancelCameraText: { color: '#fff', fontSize: 16 },
})
