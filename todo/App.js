import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { theme } from "./color";

const STOREAGE_KEY = "@toDos";
const STOREAGE_WORK = "@work";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [newText, setNewText] = useState("");
  const [toDos, setToDos] = useState({});
  const [loading, setLoading] = useState(true);
  const travel = () => {
    setWorking(false);
    AsyncStorage.setItem(STOREAGE_WORK, "false");
  };
  const work = () => {
    setWorking(true);
    AsyncStorage.setItem(STOREAGE_WORK, "true");
  };
  const onChangeText = (payload) => {
    setText(payload);
  };
  const loadWork = async () => {
    try {
      const work = await AsyncStorage.getItem(STOREAGE_WORK);
      setWorking(JSON.parse(work));
    } catch (error) {
      console.log("error!!");
    }
  };
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STOREAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    try {
      const str = await AsyncStorage.getItem(STOREAGE_KEY);
      setToDos(JSON.parse(str));
      setLoading(false);
    } catch (error) {
      console.log("error!!");
    }
  };
  useEffect(() => {
    loadWork();
    loadToDos();
  }, []);
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, work: working, editMode: false, finish: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = (key) => {
    Alert.alert("TO DO DELETE", "정말 삭제하시겠습니까?", [
      { text: "Cancle" },
      {
        text: "Ok",
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
    return;
  };
  const onFinish = (key) => {
    const newToDos = {
      ...toDos,
    };
    newToDos[key].finish = true;
    setToDos(newToDos);
    saveToDos(newToDos);
  };
  const returnFinish = (key) => {
    const newToDos = {
      ...toDos,
    };
    newToDos[key].finish = false;
    setToDos(newToDos);
    saveToDos(newToDos);
  };
  const onChangeNewText = (payload) => {
    setNewText(payload);
  };
  const onEditMode = (key) => {
    const newToDos = {
      ...toDos,
    };
    newToDos[key].editMode = true;
    setToDos(newToDos);
    saveToDos(newToDos);
    setNewText(newToDos[key].text);
  };
  const closeEditMode = (key) => {
    const newToDos = {
      ...toDos,
    };
    newToDos[key].editMode = false;
    setToDos(newToDos);
    saveToDos(newToDos);
    setNewText("");
  };
  const onSubmit = (key) => {
    const newToDos = { ...toDos };
    newToDos[key].text = newText.toString();
    newToDos[key].editMode = false;
    setToDos(newToDos);
    saveToDos(newToDos);
    setNewText("");
  };
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "#fff" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btnText, color: working ? theme.grey : "#fff" }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addToDo}
          style={styles.input}
          placeholder={
            working ? "할 일을 적어주세요." : "가고 싶은 곳을 적어주세요."
          }
          placeholderTextColor="#ccc"
          onChangeText={onChangeText}
        >
          {text}
        </TextInput>
      </View>
      {loading ? (
        <ActivityIndicator
          color="white"
          style={{ marginTop: 10, opacity: 0.5 }}
          size="large"
        />
      ) : (
        <ScrollView>
          {Object.keys(toDos).map((key) =>
            toDos[key].work === working ? (
              <View
                key={key}
                style={{
                  ...styles.toDo,
                  backgroundColor: toDos[key].finish ? "#444" : "#666",
                }}
              >
                <View style={{ flexDirection: "row", flex: 1 }}>
                  {toDos[key].finish ? (
                    <TouchableOpacity
                      onPress={() => returnFinish(key)}
                      style={{ marginRight: 6 }}
                    >
                      <MaterialIcons name="check-box" size={19} color="#999" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => onFinish(key)}
                      style={{ marginRight: 6 }}
                    >
                      <MaterialIcons
                        name="check-box-outline-blank"
                        size={19}
                        color="#999"
                      />
                    </TouchableOpacity>
                  )}
                  {toDos[key].editMode ? (
                    <TextInput
                      onChangeText={onChangeNewText}
                      onSubmitEditing={() => onSubmit(key)}
                      style={{
                        height: 20,
                        paddingHorizontal: 5,
                        color: "#fff",
                        backgroundColor: "#888",
                        borderRadius: 4,
                        flex: 1,
                      }}
                    >
                      {newText}
                    </TextInput>
                  ) : (
                    <Text
                      style={{
                        ...styles.toDoText,
                        color: toDos[key].finish ? "#888" : "#fff",
                        textDecorationLine: toDos[key].finish
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {toDos[key].text}
                    </Text>
                  )}
                </View>
                <View style={{ flexDirection: "row" }}>
                  {toDos[key].editMode ? (
                    <TouchableOpacity
                      onPress={() => onSubmit(key)}
                      style={{ marginHorizontal: 14 }}
                    >
                      <AntDesign name="save" size={18} color="#ccc" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => onEditMode(key)}
                      style={{ marginHorizontal: 14 }}
                    >
                      <AntDesign name="edit" size={18} color="#ccc" />
                    </TouchableOpacity>
                  )}
                  {toDos[key].editMode ? (
                    <TouchableOpacity onPress={() => closeEditMode(key)}>
                      <Fontisto name="close" size={16} color="#ccc" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => deleteToDo(key)}>
                      <Fontisto name="trash" size={16} color="#ccc" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : null
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnText: {
    color: "white",
    fontSize: 30,
    fontWeight: "700",
  },
  input: {
    backgroundColor: "white",
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 4,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  toDo: {
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  toDoText: {
    color: "#fff",
  },
});
