import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  )
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#1D7A5F' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f0f0f0',
          height: 72,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'CarryMate',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(sender)"
        options={{
          title: 'Send',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📦" label="Send" focused={focused} />
          ),
          href: '/(app)/(sender)/parcels',
        }}
      />
      <Tabs.Screen
        name="(traveler)"
        options={{
          title: 'Carry',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="✈️" label="Carry" focused={focused} />
          ),
          href: '/(app)/(traveler)/browse',
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔔" label="Alerts" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', paddingTop: 4 },
  tabEmoji: { fontSize: 22 },
  tabLabel: { fontSize: 10, color: '#aaa', marginTop: 2 },
  tabLabelActive: { color: '#1D7A5F', fontWeight: '600' },
})
