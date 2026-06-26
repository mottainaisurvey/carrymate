import { Stack } from 'expo-router'

export default function TravelerLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1D7A5F' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
        headerBackTitle: 'Back',
      }}
    />
  )
}
