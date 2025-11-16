import api from "./api";


export const getExamData = async()=>{
  const response = await api.get("/question/list");
  return response.data;
}


export const submitExamAnswers = async (formData: any) => {
    try {
      const response = await api.post("/answers/submit",formData);
      return response.data;
    } catch (error: any) {
      console.error("Submit Exam Error:", error.response?.data || error);
      throw error;
    }
  };