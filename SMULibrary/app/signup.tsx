import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { postSignup } from "./apis/auth";

// Zod 유효성 검사 스키마
const schema = z
  .object({
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
    studentId: z.string().min(1, { message: "학번을 입력해주세요." }),
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호를 다시 입력해주세요." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedTab, setSelectedTab] = useState<"login" | "signup">("signup");

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      studentId: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const nextStep = async () => {
    let valid = false;
    if (step === 1) valid = await trigger(["name", "studentId"]);
    if (step === 2) valid = await trigger("email");
    if (valid && step < 3) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { passwordCheck: _, ...rest } = data;
    try {
      await postSignup(rest);
      alert("회원가입에 성공했습니다!");
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
      else alert("회원가입에 실패했습니다.");
    }
  };

  // 마지막 단계일 때 비밀번호 입력 여부 체크
  const isFinalStepDisabled =
    isSubmitting ||
    !getValues("password") ||
    !getValues("passwordCheck") ||
    !!errors.password ||
    !!errors.passwordCheck;

  return (
    <View style={styles.screen}>
      {/* 로그인 / 회원가입 탭 영역 */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          onPress={() => {
            setSelectedTab("login");
            router.push("/login");
          }}
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
          onPress={() => setSelectedTab("signup")}
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

      {/* 회원가입 진행률 */}
      <Text style={styles.stepLabel}>{step} / 3</Text>

      <View style={styles.form}>
        {/* 이름 + 학번 입력 */}
        {step === 1 && (
          <>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="이름을 입력하세요."
                  style={[styles.input, errors.name && styles.inputError]}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name.message}</Text>
            )}

            <Controller
              control={control}
              name="studentId"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="학번을 입력하세요."
                  style={[styles.input, errors.studentId && styles.inputError]}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {errors.studentId && (
              <Text style={styles.errorText}>{errors.studentId.message}</Text>
            )}
          </>
        )}

        {/* 아이디 입력 */}
        {step === 2 && (
          <>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="이메일을 입력하세요."
                  style={[styles.input, errors.email && styles.inputError]}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </>
        )}

        {/* 비번 + 비번 확인 입력 */}
        {step === 3 && (
          <>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="비밀번호를 입력하세요."
                  style={[styles.input, errors.password && styles.inputError]}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}

            <Controller
              control={control}
              name="passwordCheck"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="비밀번호를 다시 입력하세요."
                  style={[
                    styles.input,
                    errors.passwordCheck && styles.inputError,
                  ]}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry
                />
              )}
            />
            {errors.passwordCheck && (
              <Text style={styles.errorText}>
                {errors.passwordCheck.message}
              </Text>
            )}

            {/* 회원가입 버튼 */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isFinalStepDisabled}
              style={[
                styles.loginBtn,
                isFinalStepDisabled
                  ? styles.loginBtnDisabled
                  : styles.loginBtnEnabled,
              ]}
            >
              <Text style={styles.loginText}>회원가입</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* 하단 이동 버튼: 모든 스텝에서 가능 */}
      <View style={styles.navRow}>
        {step > 1 ? (
          <TouchableOpacity onPress={prevStep}>
            <Text style={styles.iconArrow}>←</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {step < 3 && (
          <TouchableOpacity onPress={nextStep}>
            <Text style={styles.iconArrow}>→</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SignupPage;

const styles = StyleSheet.create({
  // 전체 화면
  screen: {
    flex: 1, // 전체 화면 높이 차지
    backgroundColor: "#fff",
    paddingHorizontal: 30, // 좌우 여백
    paddingTop: 80, // 상단 여백 (타이틀 내려오기 위함)
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F35B0",
    marginBottom: 40,
    alignSelf: "flex-end",
  },
  tabRow: {
    flexDirection: "row",
    marginBottom: 40,
  },
  tab: {
    marginRight: 24,
  },
  activeTitleTab: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F35B0",
  },
  inactiveTitleTab: {
    fontSize: 16,
    color: "#ccc",
  },
  underlineBlue: {
    width: "100%",
    height: 2,
    backgroundColor: "#0F35B0",
    marginTop: 4,
  },
  form: {
    gap: 30,
  },
  input: {
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#C20003",
  },
  errorText: {
    fontSize: 12,
    color: "#C20003",
    marginBottom: 4,
    minHeight: 16,
  },
  loginBtn: {
    height: 48,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  loginBtnDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  loginBtnEnabled: {
    backgroundColor: "#0F35B0",
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  iconArrow: {
    fontSize: 32,
    color: "#0F35B0",
  },
});
