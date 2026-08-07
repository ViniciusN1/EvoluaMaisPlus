import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Bell,
  ChevronRight,
  Crown,
  FileText,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react-native";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>
          Perfil
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <UserRound
              size={35}
              color="#208AEF"
            />
          </View>

          <View style={styles.profileContent}>
            <Text style={styles.name}>
              Vinicius
            </Text>

            <Text style={styles.email}>
              usuario@email.com
            </Text>
          </View>

          <ChevronRight
            color="#94A3B8"
            size={22}
          />
        </View>

        <View style={styles.premiumCard}>
          <View style={styles.crownBox}>
            <Crown
              size={25}
              color="#78350F"
            />
          </View>

          <View style={styles.premiumContent}>
            <Text style={styles.premiumTitle}>
              Evolua Mais Premium
            </Text>

            <Text style={styles.premiumDescription}>
              Libere IA, relatórios, fotos e
              análises avançadas.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Configurações
        </Text>

        <View style={styles.menuCard}>
          <MenuItem
            icon={
              <Bell
                size={21}
                color="#208AEF"
              />
            }
            title="Notificações"
          />

          <MenuItem
            icon={
              <FileText
                size={21}
                color="#208AEF"
              />
            }
            title="Relatórios"
          />

          <MenuItem
            icon={
              <ShieldCheck
                size={21}
                color="#208AEF"
              />
            }
            title="Privacidade e segurança"
          />

          <MenuItem
            icon={
              <Settings
                size={21}
                color="#208AEF"
              />
            }
            title="Configurações do aplicativo"
            last
          />
        </View>

        <Pressable style={styles.logoutButton}>
          <LogOut
            size={20}
            color="#EF4444"
          />

          <Text style={styles.logoutText}>
            Sair da conta
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  last?: boolean;
};

function MenuItem({
  icon,
  title,
  last = false,
}: MenuItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        last && styles.lastMenuItem,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.menuIcon}>
        {icon}
      </View>

      <Text style={styles.menuTitle}>
        {title}
      </Text>

      <ChevronRight
        size={20}
        color="#94A3B8"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6F8FC",
  },

  content: {
    padding: 24,
    paddingBottom: 120,
  },

  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 24,
  },

  profileCard: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: "#EAF5FF",
    justifyContent: "center",
    alignItems: "center",
  },

  profileContent: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    color: "#0F172A",
    fontSize: 19,
    fontWeight: "800",
  },

  email: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
  },

  premiumCard: {
    borderRadius: 24,
    backgroundColor: "#FEF3C7",
    padding: 19,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  crownBox: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: "#FBBF24",
    justifyContent: "center",
    alignItems: "center",
  },

  premiumContent: {
    flex: 1,
    marginLeft: 14,
  },

  premiumTitle: {
    color: "#78350F",
    fontSize: 16,
    fontWeight: "800",
  },

  premiumDescription: {
    color: "#92400E",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  sectionTitle: {
    color: "#0F172A",
    fontSize: 19,
    fontWeight: "800",
    marginTop: 30,
    marginBottom: 13,
  },

  menuCard: {
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 17,
  },

  menuItem: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  lastMenuItem: {
    borderBottomWidth: 0,
  },

  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#EFF8FF",
    justifyContent: "center",
    alignItems: "center",
  },

  menuTitle: {
    flex: 1,
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 13,
  },

  logoutButton: {
    height: 56,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
    marginTop: 24,
  },

  logoutText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.7,
  },
});