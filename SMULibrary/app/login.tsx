import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import useForm from "./hooks/useForm";
import { UserSignupInformation, validateSignin } from "./utils/validate";

const LoginPage = () => {
  const router = useRouter();
  const [autoLogin, setAutoLogin] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"login" | "signup">("login");

  const handleLogin = () => {
    if (values.email && values.password && !isDisabled) {
      router.push("/mainPage");
    }
  };

  const { values, errors, touched, handleChange, handleBlur } =
    useForm<UserSignupInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <View style={styles.screen}>
      {/* 탭 영역 */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          onPress={() => setSelectedTab("login")}
          style={styles.tab}
        >
          <Text
            style={
              selectedTab === "login"
                ? styles.activeTitleTab
                : styles.inactiveTitleTab
            }
          >
            LOGIN
          </Text>
          {selectedTab === "login" && <View style={styles.underlineBlue} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setSelectedTab("signup");
            router.push("/signup");
          }}
          style={styles.tab}
        >
          <Text
            style={
              selectedTab === "signup"
                ? styles.activeTitleTab
                : styles.inactiveTitleTab
            }
          >
            SIGN UP
          </Text>
          {selectedTab === "signup" && <View style={styles.underlineBlue} />}
        </TouchableOpacity>
      </View>

      {/* 입력 영역 */}
      <View style={styles.form}>
        <TextInput
          value={values.email}
          onChangeText={handleChange("email")}
          onBlur={() => handleBlur("email")}
          placeholder="이메일을 입력하세요."
          style={[
            styles.input,
            errors.email && touched.email && styles.inputError,
          ]}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.errorText}>
          {errors.email && touched.email && errors.email}
        </Text>

        <TextInput
          value={values.password}
          onChangeText={handleChange("password")}
          onBlur={() => handleBlur("password")}
          placeholder="비밀번호를 입력하세요."
          style={[
            styles.input,
            errors.password && touched.password && styles.inputError,
          ]}
          secureTextEntry
        />
        <Text style={styles.errorText}>
          {errors.password && touched.password && errors.password}
        </Text>

        {/* 자동 로그인 + 비밀번호 찾기 */}
        <View style={styles.optionRow}>
          <TouchableOpacity onPress={() => setAutoLogin(!autoLogin)}>
            <Text style={styles.optionText}>
              {autoLogin ? "☑" : "☐"} 로그인 유지
            </Text>
          </TouchableOpacity>
          <Text style={styles.optionText}>아이디 / 비밀번호 찾기</Text>
        </View>

        {/* 로그인 버튼 */}
        <TouchableOpacity
          style={[styles.loginBtn, isDisabled && styles.loginBtnDisabled]}
          onPress={handleLogin}
          disabled={isDisabled}
        >
          <Text style={styles.loginText}>로그인</Text>
        </TouchableOpacity>

        {/* 카카오 로그인 버튼 */}
        <TouchableOpacity style={styles.kakaoBtn}>
          <Text style={styles.kakaoText}>카카오 자동로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  // 전체 화면
  screen: {
    flex: 1, // 전체 화면 높이 차지
    backgroundColor: "#fff",
    paddingHorizontal: 30, // 좌우 여백
    paddingTop: 80, // 상단 여백 (타이틀 내려오기 위함)
  },

  // LOGIN / SIGNIN 텍스트가 있는 가로 줄
  tabRow: {
    flexDirection: "row", // 가로 방향으로 배치
    marginBottom: 70, // 아래 요소와 간격
  },

  // 각 탭 요소 (LOGIN, SIGNIN 텍스트 및 밑줄 포함)
  tab: {
    marginRight: 24, // 탭 사이 간격
    alignItems: "flex-start", // 텍스트 왼쪽 정렬
  },

  // 선택된 탭 (LOGIN)의 텍스트 스타일
  activeTitleTab: {
    fontSize: 16,
    fontWeight: "bold", // 굵은 글씨
    color: "#0F35B0", // 진한 파란색
  },

  // 선택되지 않은 탭 (SIGNIN)의 텍스트 스타일
  inactiveTitleTab: {
    fontSize: 16,
    color: "#ccc", // 연회색 (비활성 느낌)
  },

  // 선택된 탭 아래 파란 밑줄
  underlineBlue: {
    width: "100%", // 탭 텍스트와 같은 너비
    height: 2, // 얇은 두께
    backgroundColor: "#0F35B0",
    marginTop: 4, // 텍스트 아래 간격
  },

  // 입력 폼 wrapper (TextInput, 버튼 등)
  form: {
    gap: 5, // 요소 간 세로 간격
  },

  // TextInput 기본 스타일
  input: {
    height: 48,
    borderRadius: 999, // pill 형태 (완전 둥글게)
    borderWidth: 1,
    borderColor: "#ccc", // 기본 테두리 연회색
    paddingHorizontal: 16, // 양 옆 여백
    backgroundColor: "#fff", // 배경 흰색
  },

  // 입력 오류 시 적용되는 테두리 색
  inputError: {
    borderColor: "#C20003",
  },

  // 에러 메시지 텍스트 스타일
  errorText: {
    fontSize: 12,
    color: "#C20003",
    marginBottom: 4, // 아래 요소와 간격
    minHeight: 16, // 공간 확보 (에러 없어도 자리 차지해서 레이아웃 유지)
  },

  // 자동 로그인 + 비밀번호 찾기 줄
  optionRow: {
    flexDirection: "row", // 가로 정렬
    justifyContent: "space-between", // 좌우 정렬
    marginVertical: 20, // 위아래 간격
  },

  // 해당 줄에 쓰이는 일반 텍스트 스타일
  optionText: {
    color: "#666",
    fontSize: 13,
  },

  // 로그인 버튼 스타일
  loginBtn: {
    backgroundColor: "#0F35B0",
    height: 48,
    borderRadius: 999,
    justifyContent: "center", // 수직 정렬
    alignItems: "center", // 수평 정렬
    marginBottom: 10, // 아래 버튼과 간격
  },

  // 로그인 버튼이 비활성화되었을 때 스타일
  loginBtnDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },

  // 로그인 버튼 내 텍스트 스타일
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // 카카오 로그인 버튼 스타일 (테두리만 있음)
  kakaoBtn: {
    borderColor: "#0F35B0",
    borderWidth: 1,
    height: 48,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  // 카카오 로그인 텍스트 스타일
  kakaoText: {
    color: "#0F35B0",
    fontWeight: "600",
  },
});
