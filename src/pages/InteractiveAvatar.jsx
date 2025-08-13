import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
  STTProvider,
} from "@heygen/streaming-avatar";
import {
  Mic,
  MicOff,
  MessageSquare,
  Send,
  Trash2,
  Volume2,
  VolumeX,
  Loader2,
  Play,
  User,
  Bot,
  AlertTriangle,
  X,
  ArrowDown,
  ToggleLeft,
  Pause,
  ToggleRight,
} from "lucide-react";
import axios from "axios";

// Update your theme variables
const lightTheme = {
  "--bg-color": "#dee8f1", // Darker background
  "--text-color": "#eaf5fa", // Lighter text for better readability
  "--primary-color": "#0c3d63", // Lighter blue for primary actions
  "--secondary-color": "#dff4fb", // Darker secondary background
  "--card-bg": "#dee8f1", // Darker card background
  "--border-color": "#334155", // Darker border
  "--input-bg": "#dee8f1", // Darker input background
  "--input-text": "#0c3d63", // Lighter text for inputs
  "--label-text": "#0c3d63", // Lighter gray for labels
  "--chat-user-bg": "#0a79c4", // Blue for user chat bubbles
  "--chat-user-text": "#eaf5fa", // Light text for user chat
  "--chat-avatar-bg": "#0a79c4", // Darker green for avatar chat bubbles
  "--chat-avatar-text": "#eaf5fa", // Light green for avatar text
  "--error-bg": "#7f1d1d", // Dark red for error backgrounds
  "--error-text": "#fecaca", // Light red for error text
  "--error-color": "#f87171", // Lighter red for error accents
};

const darkTheme = {
  "--bg-color": "#07264e", // Darker background
  "--text-color": "#f8fafc", // Lighter text for better readability
  "--primary-color": "#c4ecfe", // Lighter blue for primary actions
  "--secondary-color": "#011933", // Darker secondary background
  "--card-bg": "#1e293b", // Darker card background
  "--border-color": "#334155", // Darker border
  "--input-bg": "#1e293b", // Darker input background
  "--input-text": "#f8fafc", // Lighter text for inputs
  "--label-text": "#c4ecfe", // Lighter gray for labels
  "--chat-user-bg": "#c4ecfe", // Blue for user chat bubbles
  "--chat-user-text": "#07264e", // Light text for user chat
  "--chat-avatar-bg": "#c4ecfe", // Darker green for avatar chat bubbles
  "--chat-avatar-text": "#07264e", // Light green for avatar text
  "--error-bg": "#7f1d1d", // Dark red for error backgrounds
  "--error-text": "#fecaca", // Light red for error text
  "--error-color": "#f87171", // Lighter red for error accents
};

const INACTIVITY_TIMEOUT = 300000; // 5 minutes in milliseconds
// const INACTIVITY_TIMEOUT = 120000; // 2 minutes in milliseconds

const PROMPT_DURATION = 60000; // 1 minute to respond to prompt

// Utility functions for localStorage
// Utility functions for localStorage
const saveFormDataToLocal = (formData) => {
  try {
    localStorage.setItem("disabilityAppealFormData", JSON.stringify(formData));
  } catch (error) {
    console.error("Error saving form data to localStorage:", error);
  }
};

const loadFormDataFromLocal = () => {
  try {
    const savedData = localStorage.getItem("disabilityAppealFormData");
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error("Error loading form data from localStorage:", error);
    return null;
  }
};

const clearFormDataFromLocal = () => {
  localStorage.removeItem("disabilityAppealFormData");
};

const MultiStepForm = ({
  onSubmit,
  onCancel,
  avatarRef,
  toggleForm,
  setToggleForm,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const appointments = useRef(1);
  const [formData, setFormData] = useState(() => {
    const savedData = loadFormDataFromLocal();
    if (savedData) {
      appointments.current = savedData.medicalAppointments.length;
      return savedData;
    }
    return {
      name: "",
      ssn: "",
      medicalAppointments: [
        {
          doctorName: "",
          officeName: "",
          address: "",
          medicalConditionsTreated: "",
          phone: "",
          fax: "",
          dateOfLastAppointment: "",
          dateOfNextAppointment: "",
          isNewDoctor: false,
          isDoctorSeenPreviously: false,
          isFamilyDoctor: false,
          isSpecialist: false,
          specialistType: "",
          testingOrdered: false,
          testingType: "",
          testingWhen: "",
          testingFacility: "",
        },
      ],
      conditionChanges: {
        hasChanges: false,
        description: "",
        whenChanged: "",
      },
      activityLimitations: {
        hasLimitations: false,
        examples: "",
      },
      emergencyContact: {
        name: "",
        phone: "",
        relationship: "",
      },
    };
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saveTimer = setTimeout(() => {
      saveFormDataToLocal(formData);
    }, 500);

    return () => clearTimeout(saveTimer);
  }, [formData]);

  const handleChange = (
    field,
    value,
    appointmentIndex = null,
    nestedField = null
  ) => {
    if (appointmentIndex !== null) {
      setFormData((prev) => {
        const newAppointments = [...prev.medicalAppointments];
        newAppointments[appointmentIndex] = {
          ...newAppointments[appointmentIndex],
          [field]: value,
        };
        return { ...prev, medicalAppointments: newAppointments };
      });
      setErrors((prev) => ({
        ...prev,
        [`medicalAppointments[${appointmentIndex}].${field}`]: "",
      }));
    } else if (nestedField) {
      setFormData((prev) => ({
        ...prev,
        [nestedField]: { ...prev[nestedField], [field]: value },
      }));
      setErrors((prev) => ({
        ...prev,
        [`${nestedField}.${field}`]: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  const addAppointment = () => {
    if (appointments.current > 3) return;
    setFormData((prev) => ({
      ...prev,
      medicalAppointments: [
        ...prev.medicalAppointments,
        {
          doctorName: "",
          officeName: "",
          address: "",
          medicalConditionsTreated: "",
          phone: "",
          fax: "",
          dateOfLastAppointment: "",
          dateOfNextAppointment: "",
          isNewDoctor: false,
          isDoctorSeenPreviously: false,
          isFamilyDoctor: false,
          isSpecialist: false,
          specialistType: "",
          testingOrdered: false,
          testingType: "",
          testingWhen: "",
          testingFacility: "",
        },
      ],
    }));
    appointments.current += 1;
  };

  const removeAppointment = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalAppointments: prev.medicalAppointments.filter(
        (_, i) => i !== index
      ),
    }));
    appointments.current -= 1;
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`medicalAppointments[${index}].`))
          delete newErrors[key];
      });
      return newErrors;
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }
      if (!formData.ssn.trim() || !/^\d{4}$/.test(formData.ssn)) {
        newErrors.ssn = "Last 4 digits of SSN are required";
      }
    } else if (step === 2) {
      formData.medicalAppointments.forEach((appt, index) => {
        if (appt.doctorName.trim() && !appt.dateOfLastAppointment.trim()) {
          newErrors[`medicalAppointments[${index}].dateOfLastAppointment`] =
            "Date of last appointment is required if doctor name is provided";
        }
      });
    } else if (step === 3) {
      if (
        formData.conditionChanges.hasChanges &&
        !formData.conditionChanges.description.trim()
      ) {
        newErrors["conditionChanges.description"] = "Description is required";
      }
      if (
        formData.activityLimitations.hasLimitations &&
        !formData.activityLimitations.examples.trim()
      ) {
        newErrors["activityLimitations.examples"] = "Examples are required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      setLoading(true);
      try {
        if (currentStep < 3) {
          if (avatarRef.current) {
            await avatarRef.current.speak({
              text:
                currentStep === 1
                  ? "Now let's go over your recent medical appointments like your newly scheduled appointments, your previous appointments."
                  : "Finally, we'll ask about any changes in your medical condition, change in day to day activities. We will also ask for your emergency contact information.",
              taskType: TaskType.TALK,
              taskMode: TaskMode.SYNC,
            });
          }
          setCurrentStep(currentStep + 1);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setLoading(true);
      try {
        const submissionData = { ...formData };
        console.log(submissionData);
        const FormDataObject = new FormData();
        FormDataObject.append("submission[2]", submissionData.name);
        FormDataObject.append("submission[3]", submissionData.ssn);
        FormDataObject.append(
          "submission[64]",
          submissionData.emergencyContact.name
        );
        FormDataObject.append(
          "submission[65]",
          submissionData.emergencyContact.phone
        );
        FormDataObject.append(
          "submission[66]",
          submissionData.emergencyContact.relationship
        );
        FormDataObject.append("submission[73]", "Yes");
        FormDataObject.append(
          "submission[6]",
          submissionData.medicalAppointments[0].doctorName
        );
        FormDataObject.append(
          "submission[7]",
          submissionData.medicalAppointments[0].officeName
        );
        FormDataObject.append(
          "submission[8]",
          submissionData.medicalAppointments[0].address
        );
        FormDataObject.append(
          "submission[9]",
          submissionData.medicalAppointments[0].phone
        );
        FormDataObject.append(
          "submission[10]",
          submissionData.medicalAppointments[0].fax
        );
        FormDataObject.append(
          "submission[11]",
          submissionData.medicalAppointments[0].dateOfLastAppointment
        );
        FormDataObject.append(
          "submission[12]",
          submissionData.medicalAppointments[0].dateOfNextAppointment
        );
        FormDataObject.append(
          "submission[125]",
          submissionData.medicalAppointments[0].medicalConditionsTreated
        );
        if (submissionData.medicalAppointments[0].isNewDoctor) {
          FormDataObject.append("submission[14]", "New Doctor");
        } else if (
          submissionData.medicalAppointments[0].isDoctorSeenPreviously
        ) {
          FormDataObject.append("submission[14]", "Doctor Seen Previously");
        }
        if (submissionData.medicalAppointments[0].isFamilyDoctor) {
          FormDataObject.append("submission[69]", "Family Doctor");
        } else if (submissionData.medicalAppointments[0].isSpecialist) {
          FormDataObject.append("submission[69]", "Specialist");
          FormDataObject.append(
            "submission[72]",
            submissionData.medicalAppointments[0].specialistType
          );
        }
        if (submissionData.medicalAppointments[0].testingOrdered) {
          FormDataObject.append("submission[70]", "Yes");
          FormDataObject.append(
            "submission[71]",
            submissionData.medicalAppointments[0].testingWhen
          );
          FormDataObject.append(
            "submission[15]",
            submissionData.medicalAppointments[0].testingType
          );
          FormDataObject.append(
            "submission[16]",
            submissionData.medicalAppointments[0].testingFacility
          );
        } else {
          FormDataObject.append("submission[70]", "No");
        }

        //----------------------------------
        // More than one appointments
        if (submissionData.medicalAppointments.length >= 2) {
          FormDataObject.append("submission[88]", "Yes");
          FormDataObject.append(
            "submission[126]",
            submissionData.medicalAppointments[1].medicalConditionsTreated
          );
          FormDataObject.append(
            "submission[74]",
            submissionData.medicalAppointments[1].doctorName
          );
          FormDataObject.append(
            "submission[75]",
            submissionData.medicalAppointments[1].officeName
          );
          FormDataObject.append(
            "submission[76]",
            submissionData.medicalAppointments[1].address
          );
          FormDataObject.append(
            "submission[77]",
            submissionData.medicalAppointments[1].phone
          );
          FormDataObject.append(
            "submission[78]",
            submissionData.medicalAppointments[1].fax
          );
          FormDataObject.append(
            "submission[79]",
            submissionData.medicalAppointments[1].dateOfLastAppointment
          );
          FormDataObject.append(
            "submission[80]",
            submissionData.medicalAppointments[1].dateOfNextAppointment
          );
          if (submissionData.medicalAppointments[1].isNewDoctor) {
            FormDataObject.append("submission[81]", "New Doctor");
          } else if (
            submissionData.medicalAppointments[1].isDoctorSeenPreviously
          ) {
            FormDataObject.append("submission[81]", "Doctor Seen Previously");
          }
          if (submissionData.medicalAppointments[1].isFamilyDoctor) {
            FormDataObject.append("submission[82]", "Family Doctor");
          } else if (submissionData.medicalAppointments[1].isSpecialist) {
            FormDataObject.append("submission[82]", "Specialist");
            FormDataObject.append(
              "submission[83]",
              submissionData.medicalAppointments[1].specialistType
            );
          }
          if (submissionData.medicalAppointments[1].testingOrdered) {
            FormDataObject.append("submission[84]", "Yes");
            FormDataObject.append(
              "submission[85]",
              submissionData.medicalAppointments[1].testingType
            );
            FormDataObject.append(
              "submission[86]",
              submissionData.medicalAppointments[1].testingWhen
            );
            FormDataObject.append(
              "submission[87]",
              submissionData.medicalAppointments[1].testingFacility
            );
          } else {
            FormDataObject.append("submission[84]", "No");
          }
          if (submissionData.medicalAppointments.length >= 3) {
            FormDataObject.append(
              "submission[127]",
              submissionData.medicalAppointments[2].medicalConditionsTreated
            );
            FormDataObject.append("submission[118]", "Yes");
            FormDataObject.append(
              "submission[89]",
              submissionData.medicalAppointments[2].doctorName
            );
            FormDataObject.append(
              "submission[90]",
              submissionData.medicalAppointments[2].officeName
            );
            FormDataObject.append(
              "submission[91]",
              submissionData.medicalAppointments[2].address
            );
            FormDataObject.append(
              "submission[92]",
              submissionData.medicalAppointments[2].phone
            );
            FormDataObject.append(
              "submission[93]",
              submissionData.medicalAppointments[2].fax
            );
            FormDataObject.append(
              "submission[94]",
              submissionData.medicalAppointments[2].dateOfLastAppointment
            );
            FormDataObject.append(
              "submission[95]",
              submissionData.medicalAppointments[2].dateOfNextAppointment
            );
            if (submissionData.medicalAppointments[2].isNewDoctor) {
              FormDataObject.append("submission[96]", "New Doctor");
            } else if (
              submissionData.medicalAppointments[2].isDoctorSeenPreviously
            ) {
              FormDataObject.append("submission[96]", "Doctor Seen Previously");
            }
            if (submissionData.medicalAppointments[2].isFamilyDoctor) {
              FormDataObject.append("submission[97]", "Family Doctor");
            } else if (submissionData.medicalAppointments[2].isSpecialist) {
              FormDataObject.append("submission[97]", "Specialist");
              FormDataObject.append(
                "submission[98]",
                submissionData.medicalAppointments[2].specialistType
              );
            }
            if (submissionData.medicalAppointments[2].testingOrdered) {
              FormDataObject.append("submission[99]", "Yes");
              FormDataObject.append(
                "submission[100]",
                submissionData.medicalAppointments[2].testingType
              );
              FormDataObject.append(
                "submission[101]",
                submissionData.medicalAppointments[2].testingWhen
              );
              FormDataObject.append(
                "submission[102]",
                submissionData.medicalAppointments[2].testingFacility
              );
            } else {
              FormDataObject.append("submission[99]", "No");
            }
            if (submissionData.medicalAppointments.length >= 4) {
              FormDataObject.append("submission[121]", "Yes");
              FormDataObject.append(
                "submission[128]",
                submissionData.medicalAppointments[3].medicalConditionsTreated
              );
              FormDataObject.append(
                "submission[104]",
                submissionData.medicalAppointments[3].doctorName
              );
              FormDataObject.append(
                "submission[105]",
                submissionData.medicalAppointments[3].officeName
              );
              FormDataObject.append(
                "submission[106]",
                submissionData.medicalAppointments[3].address
              );
              FormDataObject.append(
                "submission[107]",
                submissionData.medicalAppointments[3].phone
              );
              FormDataObject.append(
                "submission[108]",
                submissionData.medicalAppointments[3].fax
              );
              FormDataObject.append(
                "submission[109]",
                submissionData.medicalAppointments[3].dateOfLastAppointment
              );
              FormDataObject.append(
                "submission[110]",
                submissionData.medicalAppointments[3].dateOfNextAppointment
              );
              if (submissionData.medicalAppointments[3].isNewDoctor) {
                FormDataObject.append("submission[111]", "New Doctor");
              } else if (
                submissionData.medicalAppointments[3].isDoctorSeenPreviously
              ) {
                FormDataObject.append(
                  "submission[111]",
                  "Doctor Seen Previously"
                );
              }
              if (submissionData.medicalAppointments[3].isFamilyDoctor) {
                FormDataObject.append("submission[112]", "Family Doctor");
              } else if (submissionData.medicalAppointments[3].isSpecialist) {
                FormDataObject.append("submission[112]", "Specialist");
                FormDataObject.append(
                  "submission[113]",
                  submissionData.medicalAppointments[3].specialistType
                );
              }
              if (submissionData.medicalAppointments[3].testingOrdered) {
                FormDataObject.append("submission[114]", "Yes");
                FormDataObject.append(
                  "submission[115]",
                  submissionData.medicalAppointments[3].testingType
                );
                FormDataObject.append(
                  "submission[116]",
                  submissionData.medicalAppointments[3].testingWhen
                );
                FormDataObject.append(
                  "submission[117]",
                  submissionData.medicalAppointments[3].testingFacility
                );
              } else {
                FormDataObject.append("submission[114]", "No");
              }
            }
          }
        }
        // ---------- More than one appointments

        if (submissionData.conditionChanges) {
          FormDataObject.append("submission[123]", "Yes");
          FormDataObject.append(
            "submission[60]",
            submissionData.conditionChanges.description
          );
          FormDataObject.append(
            "submission[61]",
            submissionData.conditionChanges.whenChanged
          );
        } else {
          FormDataObject.append("submission[123]", "No");
        }
        if (submissionData.activityLimitations) {
          FormDataObject.append("submission[124]", "Yes");
          FormDataObject.append(
            "submission[62]",
            submissionData.conditionChanges.examples
          );
        } else {
          FormDataObject.append("submission[124]", "No");
        }
        clearFormDataFromLocal();
        // const response = await fetch(
        //   "https://submit.jotform.com/submit/242508927461461/",
        //   formValues,
        //   {
        //     headers: {
        //       Accept: "application/json",
        //       "Content-Type": "multipart/form-data",
        //     },
        //   }
        // );
        // const response = await fetch(
        //   "https://api.jotform.com/form/222444588328160/submissions?apiKey=07c05b71d9b676d89fe92feaa1b77979",
        //   {
        //     method: "POST",
        //     body: FormDataObject,
        //     headers: {
        //       Accept: "application/json",
        //       "Content-Type": "application/x-www-form-urlencoded",
        //     },
        //   }
        // );
        const response = await axios.post(
          "https://api.jotform.com/form/222444588328160/submissions?apiKey=07c05b71d9b676d89fe92feaa1b77979",
          FormDataObject,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        if (response.status === 200) {
          console.log("Data sent successfully:", response);
        } else {
          console.error("Failed to send data:", response);
        }
        // Swal.fire({
        //   title: 'Thank you!',
        //   text: 'Your disability appeal information has been submitted successfully.',
        //   icon: 'success',
        //   confirmButtonText: 'OK',
        // });
      } catch (error) {
        console.error("Submission error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    onCancel();
    setToggleForm(true);
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-xl shadow-md h-full flex flex-col overflow-hidden border border-[var(--border-color)]">
      <div className="border-b-[0.2px] border-[var(--border-color)] text-[var(--label-text)] px-4 py-3 flex justify-between items-center">
        <h2 className="font-semibold flex items-center gap-2">
          <User size={20} />
          {currentStep === 1
            ? "Personal Information"
            : currentStep === 2
            ? "Medical Appointments"
            : "Condition & Activities"}
          (Step {currentStep} of 3)
        </h2>
        <div className="flex items-center gap-2">
          Chat
          <button onClick={handleCancel} className="text-[var(--label-text)]">
            <ToggleRight />
          </button>
          Form
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-[var(--card-bg)]">
        <form className="space-y-4">
          {currentStep === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`w-full px-3 py-2 text-[var(--input-text)] border ${
                    errors.name
                      ? "border-red-500"
                      : "border-[var(--border-color)]"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                  Last 4 Digits of SSN *
                </label>
                <input
                  type="text"
                  maxLength="4"
                  value={formData.ssn}
                  onChange={(e) =>
                    handleChange("ssn", e.target.value.replace(/\D/g, ""))
                  }
                  className={`w-full text-[var(--input-text)] px-3 py-2 border ${
                    errors.ssn
                      ? "border-red-500"
                      : "border-[var(--border-color)]"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]`}
                  placeholder="Enter last 4 digits"
                />
                {errors.ssn && (
                  <p className="text-red-500 text-xs mt-1">{errors.ssn}</p>
                )}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h3 className="text-lg font-medium text-[var(--label-text)] mb-4">
                Medical Appointments in Last 60 Days
              </h3>
              {formData.medicalAppointments.map((appt, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-md mb-4 relative"
                >
                  <h4 className="text-md text-[var(--primary-color)] font-semibold mb-2">
                    Appointment {index + 1}
                  </h4>
                  {formData.medicalAppointments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAppointment(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                          Doctor Name
                        </label>
                        <input
                          type="text"
                          value={appt.doctorName}
                          onChange={(e) =>
                            handleChange("doctorName", e.target.value, index)
                          }
                          className={`w-full px-3 py-2 text-[var(--input-text)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]`}
                          placeholder="Enter doctor name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                          Office Name
                        </label>
                        <input
                          type="text"
                          value={appt.officeName}
                          onChange={(e) =>
                            handleChange("officeName", e.target.value, index)
                          }
                          className={`w-full px-3 py-2 text-[var(--input-text)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]`}
                          placeholder="Enter office name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={appt.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value, index)
                        }
                        className={`w-full px-3 py-2 text-[var(--input-text)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]`}
                        placeholder="Enter address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                        Medical Conditions Treated
                      </label>
                      <input
                        type="text"
                        value={appt.medicalConditionsTreated}
                        onChange={(e) =>
                          handleChange(
                            "medicalConditionsTreated",
                            e.target.value,
                            index
                          )
                        }
                        className={`w-full px-3 py-2 text-[var(--input-text)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]`}
                        placeholder="Enter conditions treated"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={appt.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value, index)
                          }
                          className={`w-full px-3 py-2 text-[var(--input-text)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]`}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                          Fax
                        </label>
                        <input
                          type="tel"
                          value={appt.fax}
                          onChange={(e) =>
                            handleChange("fax", e.target.value, index)
                          }
                          className={`w-full px-3 py-2 text-[var(--input-text)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]`}
                          placeholder="Enter fax number"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                          Date of Last Appointment
                        </label>
                        <input
                          type="date"
                          value={appt.dateOfLastAppointment}
                          onChange={(e) =>
                            handleChange(
                              "dateOfLastAppointment",
                              e.target.value,
                              index
                            )
                          }
                          className={`w-full px-3 py-2 text-[var(--input-text)] border ${
                            errors[
                              `medicalAppointments[${index}].dateOfLastAppointment`
                            ]
                              ? "border-red-500"
                              : "border-[var(--border-color)]"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]`}
                        />
                        {errors[
                          `medicalAppointments[${index}].dateOfLastAppointment`
                        ] && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              errors[
                                `medicalAppointments[${index}].dateOfLastAppointment`
                              ]
                            }
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                          Date of Next Appointment
                        </label>
                        <input
                          type="date"
                          value={appt.dateOfNextAppointment}
                          onChange={(e) =>
                            handleChange(
                              "dateOfNextAppointment",
                              e.target.value,
                              index
                            )
                          }
                          className={`w-full px-3 py-2 text-[var(--input-text)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                          Doctor Type
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={appt.isNewDoctor}
                              onChange={(e) =>
                                handleChange(
                                  "isNewDoctor",
                                  e.target.checked,
                                  index
                                )
                              }
                              className="form-checkbox"
                            />
                            New Doctor
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={appt.isDoctorSeenPreviously}
                              onChange={(e) =>
                                handleChange(
                                  "isDoctorSeenPreviously",
                                  e.target.checked,
                                  index
                                )
                              }
                              className="form-checkbox"
                            />
                            Seen Previously
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={appt.isFamilyDoctor}
                              onChange={(e) =>
                                handleChange(
                                  "isFamilyDoctor",
                                  e.target.checked,
                                  index
                                )
                              }
                              className="form-checkbox"
                            />
                            Family Doctor
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={appt.isSpecialist}
                              onChange={(e) =>
                                handleChange(
                                  "isSpecialist",
                                  e.target.checked,
                                  index
                                )
                              }
                              className="form-checkbox"
                            />
                            Specialist
                          </label>
                        </div>
                      </div>
                      {appt.isSpecialist && (
                        <div>
                          <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                            Type of Specialist
                          </label>
                          <input
                            type="text"
                            value={appt.specialistType}
                            onChange={(e) =>
                              handleChange(
                                "specialistType",
                                e.target.value,
                                index
                              )
                            }
                            className="w-full px-3 py-2 text-[var(--input-text)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]"
                            placeholder="Enter specialist type"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                        Any testing/imaging ordered by the doctor?
                      </label>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={appt.testingOrdered}
                            onChange={(e) =>
                              handleChange(
                                "testingOrdered",
                                e.target.checked,
                                index
                              )
                            }
                            className="form-checkbox"
                          />
                          Yes
                        </label>
                        {appt.testingOrdered && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                                Type of testing
                              </label>
                              <input
                                type="text"
                                value={appt.testingType}
                                onChange={(e) =>
                                  handleChange(
                                    "testingType",
                                    e.target.value,
                                    index
                                  )
                                }
                                className="w-full px-3 py-2 text-[var(--input-text)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]"
                                placeholder="Enter test type"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                                When
                              </label>
                              <input
                                type="date"
                                value={appt.testingWhen}
                                onChange={(e) =>
                                  handleChange(
                                    "testingWhen",
                                    e.target.value,
                                    index
                                  )
                                }
                                className="w-full px-3 py-2 text-[var(--input-text)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                                Facility name/address
                              </label>
                              <input
                                type="text"
                                value={appt.testingFacility}
                                onChange={(e) =>
                                  handleChange(
                                    "testingFacility",
                                    e.target.value,
                                    index
                                  )
                                }
                                className="w-full px-3 py-2 text-[var(--input-text)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]"
                                placeholder="Enter facility info"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {appointments.current < 4 && (
                <button
                  type="button"
                  onClick={addAppointment}
                  className="flex-1 py-2 px-4 border text-[var(--primary-color)] border-[var(--border-color)] rounded-md hover:text-[var(--bg-color)] hover:bg-[var(--chat-user-bg)]"
                >
                  Add Appointment
                </button>
              )}
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="border p-4 rounded-md mb-4">
                <h4 className="text-md font-medium text-[var(--label-text)] mb-2">
                  Changes in Medical Conditions/Symptoms
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                      Have your medical conditions and/or symptoms changed or
                      gotten worse in the last 60 days?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="hasChanges"
                          checked={
                            formData.conditionChanges.hasChanges === true
                          }
                          onChange={() =>
                            handleChange(
                              "hasChanges",
                              true,
                              null,
                              "conditionChanges"
                            )
                          }
                          className="form-radio"
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="hasChanges"
                          checked={
                            formData.conditionChanges.hasChanges === false
                          }
                          onChange={() =>
                            handleChange(
                              "hasChanges",
                              false,
                              null,
                              "conditionChanges"
                            )
                          }
                          className="form-radio"
                        />
                        No
                      </label>
                    </div>
                  </div>
                  {formData.conditionChanges.hasChanges && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                          Please briefly explain
                        </label>
                        <textarea
                          value={formData.conditionChanges.description}
                          onChange={(e) =>
                            handleChange(
                              "description",
                              e.target.value,
                              null,
                              "conditionChanges"
                            )
                          }
                          className={`w-full px-3 py-2 text-[var(--input-text)] border ${
                            errors["conditionChanges.description"]
                              ? "border-red-500"
                              : "border-[var(--border-color)]"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]`}
                          rows={3}
                          placeholder="Describe the changes"
                        />
                        {errors["conditionChanges.description"] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors["conditionChanges.description"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                          When did this change happen?
                        </label>
                        <input
                          type="date"
                          value={formData.conditionChanges.whenChanged}
                          onChange={(e) =>
                            handleChange(
                              "whenChanged",
                              e.target.value,
                              null,
                              "conditionChanges"
                            )
                          }
                          className="w-full px-3 py-2 text-[var(--input-text)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="border p-4 rounded-md mb-4">
                <h4 className="text-md font-medium text-[var(--label-text)] mb-2">
                  Changes in Day-to-Day Activities
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                      Any new changes or limitations in your day-to-day
                      activities (cooking, cleaning, personal care, shopping,
                      driving, socializing, etc.) in the last 60 days?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="hasLimitations"
                          checked={
                            formData.activityLimitations.hasLimitations === true
                          }
                          onChange={() =>
                            handleChange(
                              "hasLimitations",
                              true,
                              null,
                              "activityLimitations"
                            )
                          }
                          className="form-radio"
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="hasLimitations"
                          checked={
                            formData.activityLimitations.hasLimitations ===
                            false
                          }
                          onChange={() =>
                            handleChange(
                              "hasLimitations",
                              false,
                              null,
                              "activityLimitations"
                            )
                          }
                          className="form-radio"
                        />
                        No
                      </label>
                    </div>
                  </div>
                  {formData.activityLimitations.hasLimitations && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                        Please provide example(s)
                      </label>
                      <textarea
                        value={formData.activityLimitations.examples}
                        onChange={(e) =>
                          handleChange(
                            "examples",
                            e.target.value,
                            null,
                            "activityLimitations"
                          )
                        }
                        className={`w-full px-3 py-2 text-[var(--input-text)] border ${
                          errors["activityLimitations.examples"]
                            ? "border-red-500"
                            : "border-[var(--border-color)]"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]`}
                        rows={3}
                        placeholder="Describe the limitations"
                      />
                      {errors["activityLimitations.examples"] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors["activityLimitations.examples"]}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="border p-4 rounded-md">
                <h4 className="text-md font-medium text-[var(--label-text)] mb-2">
                  Emergency Contact
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact.name}
                      onChange={(e) =>
                        handleChange(
                          "name",
                          e.target.value,
                          null,
                          "emergencyContact"
                        )
                      }
                      className="w-full px-3 py-2 text-[var(--input-text)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]"
                      placeholder="Enter contact name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) =>
                        handleChange(
                          "phone",
                          e.target.value,
                          null,
                          "emergencyContact"
                        )
                      }
                      className="w-full px-3 py-2 text-[var(--input-text)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--label-text)] mb-1">
                      Relationship to you
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) =>
                        handleChange(
                          "relationship",
                          e.target.value,
                          null,
                          "emergencyContact"
                        )
                      }
                      className="w-full px-3 py-2 text-[var(--input-text)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-[var(--input-bg)]"
                      placeholder="Enter relationship"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="flex-1 py-2 px-4 border text-[var(--primary-color)] border-[var(--border-color)] rounded-md hover:text-[var(--bg-color)] hover:bg-[var(--chat-user-bg)]"
              >
                Back
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-[var(--primary-color)] text-[var(--bg-color)] rounded-md hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Processing...
                  </>
                ) : (
                  "Next"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-[var(--primary-color)] text-[var(--bg-color)] rounded-md hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            )}
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 py-2 px-4 border text-[var(--primary-color)] border-[var(--border-color)] rounded-md hover:text-[var(--bg-color)] hover:bg-[var(--chat-user-bg)]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InteractiveAvatar = () => {
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [avatarMuted, setAvatarMuted] = useState(false);
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [chatMode, setChatMode] = useState("text_mode");
  const [stream, setStream] = useState(null);
  const [userVoiceInput, setUserVoiceInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [toggleForm, setToggleForm] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [inactivityPromptShown, setInactivityPromptShown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const videoRef = useRef(null);
  const avatarRef = useRef(null);
  const avatarResponseRef = useRef("");
  const chatContainerRef = useRef(null);
  const processedMessagesRef = useRef(new Set());
  const processedVoiceMessagesRef = useRef(new Set());
  const chatModeRef = useRef(chatMode);
  const inactivityTimerRef = useRef(null);
  const promptTimerRef = useRef(null);
  const API_KEY = process.env.REACT_APP_HEYGEN_API_KEY;
  const API_URL = process.env.REACT_APP_BASE_API_URL;
  const DEFAULT_AVATAR_ID = "3c592a67d01344f5b1d398d169e4b7d4";

  // Track user activity
  const updateActivity = () => {
    setLastActivityTime(Date.now());
    if (inactivityPromptShown) {
      setInactivityPromptShown(false);
      if (promptTimerRef.current) {
        clearTimeout(promptTimerRef.current);
      }
    }
  };

  useEffect(() => {
    const theme = darkMode ? darkTheme : lightTheme;
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [darkMode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("themePreference");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  // Update toggleTheme
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("themePreference", newMode ? "dark" : "light");
  };

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDarkMode(true);
    }
  }, []);
  // Set up event listeners for user activity
  useEffect(() => {
    const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];
    const handleActivity = () => updateActivity();

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  // Monitor inactivity and show prompt
  useEffect(() => {
    if (connectionStatus !== "connected") return;

    const checkInactivity = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - lastActivityTime;

      if (elapsed >= INACTIVITY_TIMEOUT && !inactivityPromptShown) {
        showInactivityPrompt();
      }
    };

    inactivityTimerRef.current = setInterval(checkInactivity, 1000);

    return () => {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
      }
    };
  }, [lastActivityTime, inactivityPromptShown, connectionStatus]);

  const showInactivityPrompt = async () => {
    setInactivityPromptShown(true);

    try {
      if (avatarRef.current) {
        await avatarRef.current.speak({
          text: "Are you still there? If yes, add more minutes. If not, I will disconnect in 30 seconds.",
          taskType: TaskType.TALK,
          taskMode: TaskMode.SYNC,
        });
      }
      console.log("Inactivity prompt shown1");
      promptTimerRef.current = setTimeout(() => {
        console.log("Inactivity prompt shown2");

        console.log("Session ended due to inactivity");
        endSession();
      }, PROMPT_DURATION);
    } catch (error) {
      console.error("Error showing inactivity prompt:", error);
    }
  };

  // Update activity when user interacts with chat
  const addToChat = (message, type, mode) => {
    updateActivity();
    const messageId = `${message}-${type}-${mode}-${Date.now()}`;
    if (processedMessagesRef.current.has(messageId)) return;
    processedMessagesRef.current.add(messageId);
    const newMessage = {
      message,
      type,
      mode,
      timestamp: new Date().toISOString(),
    };
    setChat((prev) => [...prev, newMessage]);
  };

  const replaceEmptyWithNA = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(replaceEmptyWithNA);
    } else if (obj && typeof obj === "object") {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          if (typeof value === "string" && value.trim() === "") {
            return [key, "NA"];
          } else if (typeof value === "object") {
            return [key, replaceEmptyWithNA(value)];
          } else {
            return [key, value];
          }
        })
      );
    }
    return obj;
  };

  const submitFormData = async (formData) => {
    let payload = {
      ...formData,
      timestamp: new Date().toISOString(),
      chatHistory: chat,
    };
    console.log("Payload 1", payload);

    payload = replaceEmptyWithNA(payload);
    console.log("Payload 2", payload);

    try {
      const response = await fetch(
        // 'https://api.goodtogoapps.com/api/form-data',
        "http://localhost:3002/api/disability-appeal",

        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to submit form data: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Form data submitted successfully:", result);

      if (avatarRef.current && connectionStatus === "connected") {
        await avatarRef.current.speak({
          text: "Thanks for submitting your information.",
          taskType: TaskType.TALK,
          taskMode: TaskMode.SYNC,
        });
      }

      setShowForm(false);

      // Show success message
      Swal.fire({
        title: "Thank you!",
        text: "Your information has been submitted successfully. Our team will reach out to you soon.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // End the session after successful submission
      await endSession();
    } catch (error) {
      console.error("Error submitting form data:", error);
      setErrorMessage("Failed to submit form data. Please try again.");
    }
  };

  const handleError = (error) => {
    console.error("Avatar error:", error);
    if (error.name === "NotFoundError")
      setErrorMessage(
        "Microphone not found. Please connect a microphone and allow access."
      );
    else if (error.name === "NotAllowedError")
      setErrorMessage(
        "Microphone access denied. Please allow microphone permissions."
      );
    else setErrorMessage("An error occurred: " + error.message);
    if (connectionStatus !== "connected") setConnectionStatus("disconnected");
  };

  useEffect(() => {
    if (chatContainerRef.current)
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    const lastMessage = chat[chat.length - 1];
    if (
      lastMessage &&
      lastMessage.type === "avatar" &&
      lastMessage.message
        .toLowerCase()
        .includes("start with your basic information") &&
      !showForm &&
      !toggleForm
    ) {
      console.log(lastMessage.message, "I am last");
      setShowForm(true);
    }
  }, [chat, showForm]);

  useEffect(() => {
    chatModeRef.current = chatMode;
  }, [chatMode]);

  const getStreamingToken = async () => {
    try {
      const response = await fetch(`${API_URL}/v1/streaming.create_token`, {
        method: "POST",
        headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
      });
      if (!response.ok)
        throw new Error(`API request failed with status ${response.status}`);
      const data = await response.json();
      return data.data.token;
    } catch (error) {
      console.error("Error fetching streaming token:", error);
      handleError(error);
      return null;
    }
  };

  const startVoiceChat = async () => {
    try {
      if (!avatarRef.current)
        throw new Error("Avatar reference not initialized");
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await avatarRef.current.startVoiceChat({
        useSilencePrompt: true,
        isInputAudioMuted: false,
        sttProvider: STTProvider.DEEPGRAM,
      });
      setChatMode("voice_mode");
      setUserVoiceInput("");
      avatarResponseRef.current = "";
      setErrorMessage("");
    } catch (error) {
      console.error("Error starting voice chat:", error);
      handleError(error);
      setChatMode("text_mode");
    }
  };

  const stopVoiceChat = async () => {
    try {
      if (avatarRef.current) {
        await avatarRef.current.closeVoiceChat();
        if (userVoiceInput.trim()) {
          addToChat(userVoiceInput, "user", "voice_mode");
          setUserVoiceInput("");
        }
      }
    } catch (error) {
      console.warn("Error stopping voice chat:", error);
    }
  };

  const handleUserVoiceInput = (event) => {
    if (!event.detail?.message || chatModeRef.current !== "voice_mode") return;
    const userMessage = event.detail.message.trim();
    if (!userMessage) return;
    const messageKey = `${userMessage}-voice-${Date.now()}`;
    if (processedVoiceMessagesRef.current.has(messageKey)) return;
    processedVoiceMessagesRef.current.add(messageKey);
    setTimeout(
      () => processedVoiceMessagesRef.current.delete(messageKey),
      5000
    );
    setUserVoiceInput(userMessage);
    addToChat(userMessage, "user", "voice_mode");
  };

  const startSession = async () => {
    setIsLoading(true);
    setConnectionStatus("connecting");
    try {
      const token = await getStreamingToken();
      if (!token) throw new Error("Failed to obtain streaming token");
      if (avatarRef.current) {
        await avatarRef.current.stopAvatar().catch(console.warn);
        avatarRef.current = null;
      }
      processedMessagesRef.current = new Set();
      processedVoiceMessagesRef.current = new Set();
      avatarRef.current = new StreamingAvatar({ token, basePath: API_URL });
      avatarRef.current.on(StreamingEvents.ERROR, handleError);
      avatarRef.current.on(StreamingEvents.STREAM_READY, handleStreamReady);
      avatarRef.current.on(StreamingEvents.STREAM_DISCONNECTED, endSession);
      avatarRef.current.on(
        StreamingEvents.AVATAR_TALKING_MESSAGE,
        handleAvatarSpeaking
      );
      avatarRef.current.on(StreamingEvents.AVATAR_END_MESSAGE, handleAvatarEnd);
      avatarRef.current.on(
        StreamingEvents.USER_TALKING_MESSAGE,
        handleUserVoiceInput
      );
      avatarRef.current.on(StreamingEvents.USER_START, () =>
        setIsUserTalking(true)
      );
      avatarRef.current.on(StreamingEvents.USER_STOP, () =>
        setIsUserTalking(false)
      );
      await avatarRef.current.createStartAvatar({
        quality: AvatarQuality.Medium,
        avatarName: DEFAULT_AVATAR_ID,
        voice: { rate: 1.2, emotion: VoiceEmotion.NEUTRAL },
        language: "en",
        disableIdleTimeout: true,
      });
      await avatarRef.current.speak({
        text: "Hi there! I am here to virtually help and guide you through the Disability Application form. Each section is needed and important to move forward with your case. When ready to begin, type or say: ‘Ready to begin",
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.SYNC,
      });
      setConnectionStatus("connected");
    } catch (error) {
      console.error("Error starting session:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamReady = (event) => {
    setConnectionStatus("ready");
    const mediaStream = event?.detail;
    setStream(mediaStream);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () =>
          videoRef.current.play().catch(console.error);
      }
    }, 500);
  };

  const handleAvatarSpeaking = (event) => {
    if (event.detail?.message)
      avatarResponseRef.current += event.detail.message;
  };

  const handleAvatarEnd = () => {
    if (avatarResponseRef.current) {
      addToChat(avatarResponseRef.current, "avatar", chatMode);
      avatarResponseRef.current = "";
    }
  };

  const endSession = async () => {
    setConnectionStatus("disconnected");
    if (userVoiceInput.trim()) {
      addToChat(userVoiceInput, "user", "voice_mode");
      setUserVoiceInput("");
    }
    if (avatarResponseRef.current) {
      addToChat(avatarResponseRef.current, "avatar", chatMode);
      avatarResponseRef.current = "";
    }
    if (avatarRef.current) {
      try {
        if (chatMode === "voice_mode") {
          await stopVoiceChat();
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
        await avatarRef.current.interrupt().catch(console.warn);
        await avatarRef.current.stopAvatar();
      } catch (error) {
        if (!error.message.includes("DataChannel error"))
          console.error("Error stopping avatar:", error);
      } finally {
        avatarRef.current = null;
      }
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setChat([]);
    setShowForm(false);
    setErrorMessage("");
    setIsPaused(false);
  };

  const handleSpeak = async () => {
    if (!text.trim() || !avatarRef.current) return;
    updateActivity();
    try {
      addToChat(text, "user", "text_mode");
      await avatarRef.current.speak({
        text: text,
        taskType: TaskType.TALK,
        taskMode: TaskMode.SYNC,
      });
      setText("");
    } catch (error) {
      console.error("Error in handleSpeak:", error);
      handleError(error);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !avatarMuted;
      setAvatarMuted(!avatarMuted);
    }
  };

  const togglePause = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const handleChatModeChange = async (mode) => {
    if (mode === chatMode || !avatarRef.current) return;
    try {
      if (mode === "voice_mode") await startVoiceChat();
      else {
        await stopVoiceChat();
        setChatMode("text_mode");
      }
    } catch (error) {
      console.error("Error changing chat mode:", error);
      handleError(error);
      setChatMode("text_mode");
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () =>
        videoRef.current.play().catch(console.error);
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      if (avatarRef.current) avatarRef.current.stopAvatar().catch(console.warn);
    };
  }, []);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
      }
      if (promptTimerRef.current) {
        clearTimeout(promptTimerRef.current);
      }
    };
  }, []);

  return (
    <div className=" bg-[var(--card-bg)] w-screen h-screen  ">
      <div className="p-4 md:p-8">
        <div className="mx-auto p-4 flex justify-between items-center ">
          <img
            src="/linerlegallaw.png"
            className="w-[300px]"
            alt="Liner Legal Logo"
          />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[var(--primary-color)] text-[var(--bg-color)]  hover:text-white transition-colors"
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
          >
            {darkMode ? (
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
                Light Mode
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                Dark Mode
              </span>
            )}
          </button>
        </div>

        <div className="flex max-w-[1780px] mx-auto w-full gap-4 h-[calc(100vh-200px)]">
          <div className="md:max-w-[50%] w-full">
            <div className="bg-[var(--card-bg)] rounded-xl shadow-xl h-full flex flex-col">
              <div className="flex-1 bg-[var(--secondary-color)] relative rounded-t-2xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted={avatarMuted}
                  className={`w-full h-full object-cover rounded-t-2xl   ${
                    connectionStatus !== "connected" ? "hidden" : ""
                  }`}
                />
                {connectionStatus === "connected" ? (
                  <>
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button
                        onClick={toggleMute}
                        className="p-2 text-[var(--card-bg)] bg-[var(--primary-color)]  rounded-full shadow-md ]"
                        aria-label={avatarMuted ? "Unmute" : "Mute"}
                      >
                        {avatarMuted ? (
                          <VolumeX size={20} />
                        ) : (
                          <Volume2 size={20} />
                        )}
                      </button>
                      <button
                        onClick={togglePause}
                        className="p-2 text-[var(--card-bg)] bg-[var(--primary-color)] rounded-full shadow-md "
                        aria-label={isPaused ? "Play" : "Pause"}
                      >
                        {isPaused ? <Play size={20} /> : <Pause size={20} />}
                      </button>
                      <button
                        onClick={endSession}
                        className="p-2  bg-[var(--primary-color)] rounded-full cursor-pointer shadow-md  text-red-500"
                        aria-label="End Session"
                      >
                        End Session
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-[var(--card-bg)] px-3 py-1 rounded-lg shadow-md">
                      <span className="w-2 h-2 rounded-full mr-2 bg-green-500 inline-block"></span>
                      <span className="text-sm text-[var(--primary-color)] font-medium">
                        Connected
                      </span>
                    </div>
                    {errorMessage && (
                      <div className="absolute top-10 left-4 bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-md">
                        <span className="flex items-center gap-2">
                          <AlertTriangle size={20} />
                          {errorMessage}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-6">
                    <div className="max-w-md w-full space-y-4">
                      <h2 className="text-xl font-semibold text-center text-[var(--primary-color)]">
                        Start Your Avatar Session
                      </h2>
                      {errorMessage && (
                        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
                          <span className="flex items-center gap-2">
                            <AlertTriangle size={20} />
                            {errorMessage}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={startSession}
                        disabled={isLoading}
                        className={`w-full py-3 cursor-pointer px-4 rounded-lg font-medium text-white ${
                          isLoading
                            ? "   bg-gradient-to-br from-[#097FCD] to-[#0B3759] text-white"
                            : "bg-gradient-to-br from-[#097FCD] to-[#0B3759] text-white  "
                        }`}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={20} />
                            Initializing...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Play size={20} />
                            Start Session
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className=" p-4">
                <div className="flex">
                  <button
                    onClick={() => handleChatModeChange("text_mode")}
                    className={`flex-1 cursor-pointer py-2 font-medium ${
                      chatMode === "text_mode"
                        ? "text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]"
                        : "text-[var(--primary-color)]"
                    }`}
                    aria-label="Text Mode"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <MessageSquare size={18} />
                      Text Mode
                    </span>
                  </button>
                  <button
                    onClick={() => handleChatModeChange("voice_mode")}
                    className={`flex-1 cursor-pointer py-2 font-medium ${
                      chatMode === "voice_mode"
                        ? "text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]"
                        : "text-[var(--primary-color)]"
                    }`}
                    aria-label="Voice Mode"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Mic size={18} />
                      Voice Mode
                    </span>
                  </button>
                </div>

                {chatMode === "text_mode" ? (
                  <div className="flex gap-2 mt-4">
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSpeak()}
                      placeholder="Type your message here..."
                      className="flex-1 p-2 border rounded-full focus:outline-none text-[var(--primary-color)] border-[var(--primary-color)] disabled:bg-[var(--secondary-color)]"
                      disabled={connectionStatus !== "connected" || showForm}
                      aria-label="Type your message"
                    />
                    <button
                      onClick={handleSpeak}
                      disabled={
                        !text.trim() ||
                        connectionStatus !== "connected" ||
                        showForm
                      }
                      className="p-2 bg-[var(--primary-color)] text-[var(--bg-color)] rounded-full disabled:bg-gray-300 hover:bg-blue-700"
                      aria-label="Send message"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`p-3 mt-4 rounded-full text-center ${
                      isUserTalking
                        ? " bg-gradient-to-br from-[#097FCD] to-[#0B3759] text-white"
                        : " bg-gradient-to-br from-[#097FCD] to-[#0B3759] text-white"
                    }`}
                  >
                    {isUserTalking ? (
                      <span className="flex items-center justify-center gap-2">
                        <Mic className="text-white animate-pulse" size={20} />
                        Listening...
                      </span>
                    ) : (
                      <span className="flex text-white  items-center justify-center gap-2">
                        <Mic className="text-white" size={20} />
                        Speak to interact
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="md:max-w-[50%] w-full">
            {showForm ? (
              <MultiStepForm
                onSubmit={submitFormData}
                onCancel={() => setShowForm(false)}
                avatarRef={avatarRef}
                toggleForm={toggleForm}
                setToggleForm={setToggleForm}
              />
            ) : (
              <div className="bg-[var(--card-bg)] flex rounded-2xl shadow-xl h-full flex-col">
                <div className=" bg-[var(--card-bg)]  border border-[var(--border-color)] rounded-t-2xl text-[var(--primary-color)] px-6 py-3 flex justify-between items-center">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <MessageSquare size={20} />
                    Chat History
                  </h3>
                  <div className="flex items-center gap-2">
                    Chat
                    <button
                      onClick={() => {
                        setToggleForm(false);
                        setShowForm(!showForm);
                      }}
                      disabled={chat.length === 0}
                      aria-label="Toggle Form"
                    >
                      <ToggleLeft />
                    </button>
                    Form
                  </div>
                </div>
                <div
                  ref={chatContainerRef}
                  className="p-4 flex-1 bg-[var(--secondary-color)] rounded-b-2xl overflow-y-auto"
                >
                  {chat.length === 0 ? (
                    <div className="h-full flex items-center justify-center flex-col">
                      <MessageSquare
                        size={40}
                        className="text-[var(--primary-color)] mb-4"
                      />
                      <p className="text-[var(--primary-color)]">
                        No messages yet
                      </p>
                      <p className="text-[var(--primary-color)] text-sm mt-2">
                        {connectionStatus === "connected"
                          ? "Start chatting with the avatar!"
                          : "Start a session to begin chatting."}
                      </p>
                    </div>
                  ) : (
                    // <div className='space-y-4'>
                    //   {chat.map((msg, index) => {
                    //     const prevMsg = index > 0 ? chat[index - 1] : null;
                    //     const showHeader =
                    //       !prevMsg || prevMsg.type !== msg.type;
                    //     return (
                    //       <div
                    //         key={index}
                    //         className={`flex ${msg.type === 'user'
                    //           ? 'justify-end'
                    //           : 'justify-start'
                    //           }`}
                    //       >
                    //         <div
                    //           className={`p-2 max-w-md ${msg.type === 'user'
                    //             ?'bg-[var(--chat-user-bg)] text-[var(--chat-user-text)] rounded-br-none'
                    //             : 'bg-[var(--chat-avatar-bg)] text-[var(--chat-avatar-text)] rounded-bl-none'
                    //             }`}
                    //         >
                    //           {showHeader && (
                    //             <p className='text-xs font-bold mb-1'>
                    //               {msg.type === 'user' ? (
                    //                 <span className='flex items-center gap-1'>
                    //                   <User size={12} />
                    //                   You
                    //                 </span>
                    //               ) : (
                    //                 <span className='flex items-center gap-1'>
                    //                   <svg
                    //                     xmlns='http://www.w3.org/2000/svg'
                    //                     viewBox='0 0 12 7.8'
                    //                     className='w-[30px] h-[30px] fill-[#097fcd]'
                    //                   >
                    //                     <title>SCREENAsset 6mdpi</title>
                    //                     <g id='Layer_2' data-name='Layer 2'>
                    //                       <g id='Layer_1-2' data-name='Layer 1'>
                    //                         <path d='M1.73,2.38a12.63,12.63,0,0,1,1.21.89l.41.33a4.89,4.89,0,0,1-.1-.78L2.87,2.5,1.56,1.42a.19.19,0,0,1-.05-.09C1.36.52,0,.47,0,.47S.22,1.78,1.06,1.85A.15.15,0,0,1,1.2,2c0,.43.1.49.17.58a.45.45,0,0,1,.07.18,5.86,5.86,0,0,0,1,2.82,1.89,1.89,0,0,1,0-.43.11.11,0,0,1,.11-.09l.15,0a5.65,5.65,0,0,1-.91-1.82,4.15,4.15,0,0,1,.66,1.08A.56.56,0,0,1,3,4.45c0-.66-.62-1.27-1-1.67A1.17,1.17,0,0,1,1.73,2.38Zm1,.34C2.38,2.5,2,2.28,2,2.08,2.3,2.08,2.53,2.34,2.75,2.72ZM.4.8c.42.09.71.28.74.69C.85,1.57.65,1,.4.8Z' />
                    //                         <path d='M10.55,1.09a.13.13,0,0,1-.05.09L9.33,2.29,9,2.64a7,7,0,0,1-.1.83l.41-.38a10.58,10.58,0,0,1,1.12-.94,1.3,1.3,0,0,1-.22.42C9.85,3,9.27,3.64,9.32,4.3a.55.55,0,0,1,.41-.19A4.29,4.29,0,0,1,10.33,3a5.87,5.87,0,0,1-.8,1.87h.15A.11.11,0,0,1,9.8,5a1.73,1.73,0,0,1,0,.42,5.82,5.82,0,0,0,.86-2.88.64.64,0,0,1,.06-.18c.07-.1.15-.16.14-.59A.14.14,0,0,1,11,1.58c.83-.12,1-1.45,1-1.45S10.65.27,10.55,1.09ZM9.41,2.55c.19-.39.4-.66.66-.68C10.11,2.07,9.76,2.31,9.41,2.55Zm1.52-1.32c0-.42.28-.63.7-.74C11.39.74,11.22,1.29,10.93,1.23Z' />
                    //                         <path d='M4,5.45a2.89,2.89,0,0,1-.21.28A8.55,8.55,0,0,1,1.76,7.57a14.88,14.88,0,0,1,2-1.94L4,5.42a2.12,2.12,0,0,1-.11-.21l-.24.23-2,1.9V7.8H2L4,5.93l.24-.22A2.33,2.33,0,0,1,4,5.45Z' />
                    //                         <path d='M8.07,5.66a8.81,8.81,0,0,1,2.2,1.57A9.65,9.65,0,0,1,8.07,5.66Zm.36,0-.27-.19a4.38,4.38,0,0,1-.28.42l.27.2,2,1.39h.39V7.05Z' />
                    //                         <path d='M4,5.42l-.24.21.05.1A2.89,2.89,0,0,0,4,5.45ZM9.25.64A6.73,6.73,0,0,1,6.13,0,6.54,6.54,0,0,1,2.94.64a8.82,8.82,0,0,0-.08,1.58,2.53,2.53,0,0,0,0,.28,6.12,6.12,0,0,0,.07.77,6,6,0,0,0,.73,2.17l.11.19.05.1a2.43,2.43,0,0,1,.14.2A4.78,4.78,0,0,0,6.05,7.71h.1A4.81,4.81,0,0,0,8.15,6c.1-.14.19-.28.28-.43a6.14,6.14,0,0,0,.85-2.52,5.13,5.13,0,0,0,.05-.8.17.17,0,0,0,0-.07A7.76,7.76,0,0,0,9.25.64ZM8.87,3.47a5.59,5.59,0,0,1-.71,1.95,4.38,4.38,0,0,1-.28.42,4.47,4.47,0,0,1-1.81,1.5A4.34,4.34,0,0,1,4.21,5.71,2.33,2.33,0,0,1,4,5.45l0,0a2.12,2.12,0,0,1-.11-.21A5.63,5.63,0,0,1,3.35,3.6a4.89,4.89,0,0,1-.1-.78,5.74,5.74,0,0,1,0-.6c0-.36,0-.9,0-1.23A7.2,7.2,0,0,0,6.14.4,7.31,7.31,0,0,0,9,1c0,.33,0,.87,0,1.23,0,.14,0,.28,0,.42A7,7,0,0,1,8.87,3.47Z' />
                    //                         <path d='M7.25,5.2c0,.11-.06.14-.32.14l-.85,0H4.84c-.07,0-.1,0-.1-.05s0,0,.08,0l.18,0c.1,0,.13-.13.15-.27s0-.61,0-1.07V3c0-.77,0-.91,0-1.07s0-.25-.21-.28l-.17,0c-.06,0-.08,0-.08,0s0-.05.11-.05l.68,0,.68,0c.07,0,.11,0,.11.05s0,0-.09,0l-.2,0c-.13,0-.17.11-.18.28s0,.3,0,1.07v.88c0,.64,0,1,.1,1.08s.22.11.61.11a.8.8,0,0,0,.59-.14.67.67,0,0,0,.13-.3s0-.08,0-.08,0,0,0,.08A3.74,3.74,0,0,1,7.25,5.2Z' />
                    //                         <path d='M7.75,4.08c0,.07,0,.09-.19.09H6.33s-.06,0-.06,0,0,0,0,0h.11c.06,0,.08-.08.09-.16s0-.36,0-.63V2.78c0-.45,0-.54,0-.63S6.49,2,6.39,2h-.1s0,0,0,0,0,0,.07,0h.8s.07,0,.07,0,0,0-.06,0H7c-.08,0-.11.06-.11.17s0,.18,0,.63V3.3c0,.38,0,.58.06.63s.13.07.36.07.27,0,.35-.08a.58.58,0,0,0,.08-.18s0-.05,0-.05,0,0,0,.05A2.55,2.55,0,0,1,7.75,4.08Z' />
                    //                       </g>
                    //                     </g>
                    //                   </svg>
                    //                   Michael
                    //                 </span>
                    //               )}
                    //             </p>
                    //           )}
                    //           <p>{msg.message}</p>
                    //           <p className='text-gray-400 text-xs mt-1'>
                    //             {new Date(msg.timestamp).toLocaleTimeString()}
                    //           </p>
                    //         </div>
                    //       </div>
                    //     );
                    //   })}
                    // </div>
                    <div className="space-y-4 px-4 py-6">
                      {chat.map((msg, index) => {
                        const prevMsg = index > 0 ? chat[index - 1] : null;
                        const showHeader =
                          !prevMsg || prevMsg.type !== msg.type;
                        const isUser = msg.type === "user";

                        return (
                          <div
                            key={index}
                            className={`flex ${
                              isUser ? "justify-end" : "justify-start"
                            } animate-fadeIn`}
                          >
                            <div
                              className={`relative p-4 max-w-[75%] text-sm md:text-base rounded-2xl shadow-md
          ${
            isUser
              ? "bg-[var(--chat-user-bg)] text-[var(--chat-user-text)] rounded-br-none"
              : "bg-[var(--chat-avatar-bg)] text-[var(--chat-avatar-text)] rounded-bl-none"
          }`}
                            >
                              {showHeader && (
                                <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                                  {isUser ? (
                                    <>
                                      <User size={14} /> You
                                    </>
                                  ) : (
                                    <>
                                      {darkMode ? (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 12 7.8"
                                          className="w-[30px] h-[30px] fill-[#097fcd]"
                                        >
                                          <title>SCREENAsset 6mdpi</title>
                                          <g id="Layer_2" data-name="Layer 2">
                                            <g
                                              id="Layer_1-2"
                                              data-name="Layer 1"
                                            >
                                              <path d="M1.73,2.38a12.63,12.63,0,0,1,1.21.89l.41.33a4.89,4.89,0,0,1-.1-.78L2.87,2.5,1.56,1.42a.19.19,0,0,1-.05-.09C1.36.52,0,.47,0,.47S.22,1.78,1.06,1.85A.15.15,0,0,1,1.2,2c0,.43.1.49.17.58a.45.45,0,0,1,.07.18,5.86,5.86,0,0,0,1,2.82,1.89,1.89,0,0,1,0-.43.11.11,0,0,1,.11-.09l.15,0a5.65,5.65,0,0,1-.91-1.82,4.15,4.15,0,0,1,.66,1.08A.56.56,0,0,1,3,4.45c0-.66-.62-1.27-1-1.67A1.17,1.17,0,0,1,1.73,2.38Zm1,.34C2.38,2.5,2,2.28,2,2.08,2.3,2.08,2.53,2.34,2.75,2.72ZM.4.8c.42.09.71.28.74.69C.85,1.57.65,1,.4.8Z" />
                                              <path d="M10.55,1.09a.13.13,0,0,1-.05.09L9.33,2.29,9,2.64a7,7,0,0,1-.1.83l.41-.38a10.58,10.58,0,0,1,1.12-.94,1.3,1.3,0,0,1-.22.42C9.85,3,9.27,3.64,9.32,4.3a.55.55,0,0,1,.41-.19A4.29,4.29,0,0,1,10.33,3a5.87,5.87,0,0,1-.8,1.87h.15A.11.11,0,0,1,9.8,5a1.73,1.73,0,0,1,0,.42,5.82,5.82,0,0,0,.86-2.88.64.64,0,0,1,.06-.18c.07-.1.15-.16.14-.59A.14.14,0,0,1,11,1.58c.83-.12,1-1.45,1-1.45S10.65.27,10.55,1.09ZM9.41,2.55c.19-.39.4-.66.66-.68C10.11,2.07,9.76,2.31,9.41,2.55Zm1.52-1.32c0-.42.28-.63.7-.74C11.39.74,11.22,1.29,10.93,1.23Z" />
                                              <path d="M4,5.45a2.89,2.89,0,0,1-.21.28A8.55,8.55,0,0,1,1.76,7.57a14.88,14.88,0,0,1,2-1.94L4,5.42a2.12,2.12,0,0,1-.11-.21l-.24.23-2,1.9V7.8H2L4,5.93l.24-.22A2.33,2.33,0,0,1,4,5.45Z" />
                                              <path d="M8.07,5.66a8.81,8.81,0,0,1,2.2,1.57A9.65,9.65,0,0,1,8.07,5.66Zm.36,0-.27-.19a4.38,4.38,0,0,1-.28.42l.27.2,2,1.39h.39V7.05Z" />
                                              <path d="M4,5.42l-.24.21.05.1A2.89,2.89,0,0,0,4,5.45ZM9.25.64A6.73,6.73,0,0,1,6.13,0,6.54,6.54,0,0,1,2.94.64a8.82,8.82,0,0,0-.08,1.58,2.53,2.53,0,0,0,0,.28,6.12,6.12,0,0,0,.07.77,6,6,0,0,0,.73,2.17l.11.19.05.1a2.43,2.43,0,0,1,.14.2A4.78,4.78,0,0,0,6.05,7.71h.1A4.81,4.81,0,0,0,8.15,6c.1-.14.19-.28.28-.43a6.14,6.14,0,0,0,.85-2.52,5.13,5.13,0,0,0,.05-.8.17.17,0,0,0,0-.07A7.76,7.76,0,0,0,9.25.64ZM8.87,3.47a5.59,5.59,0,0,1-.71,1.95,4.38,4.38,0,0,1-.28.42,4.47,4.47,0,0,1-1.81,1.5A4.34,4.34,0,0,1,4.21,5.71,2.33,2.33,0,0,1,4,5.45l0,0a2.12,2.12,0,0,1-.11-.21A5.63,5.63,0,0,1,3.35,3.6a4.89,4.89,0,0,1-.1-.78,5.74,5.74,0,0,1,0-.6c0-.36,0-.9,0-1.23A7.2,7.2,0,0,0,6.14.4,7.31,7.31,0,0,0,9,1c0,.33,0,.87,0,1.23,0,.14,0,.28,0,.42A7,7,0,0,1,8.87,3.47Z" />
                                              <path d="M7.25,5.2c0,.11-.06.14-.32.14l-.85,0H4.84c-.07,0-.1,0-.1-.05s0,0,.08,0l.18,0c.1,0,.13-.13.15-.27s0-.61,0-1.07V3c0-.77,0-.91,0-1.07s0-.25-.21-.28l-.17,0c-.06,0-.08,0-.08,0s0-.05.11-.05l.68,0,.68,0c.07,0,.11,0,.11.05s0,0-.09,0l-.2,0c-.13,0-.17.11-.18.28s0,.3,0,1.07v.88c0,.64,0,1,.1,1.08s.22.11.61.11a.8.8,0,0,0,.59-.14.67.67,0,0,0,.13-.3s0-.08,0-.08,0,0,0,.08A3.74,3.74,0,0,1,7.25,5.2Z" />
                                              <path d="M7.75,4.08c0,.07,0,.09-.19.09H6.33s-.06,0-.06,0,0,0,0,0h.11c.06,0,.08-.08.09-.16s0-.36,0-.63V2.78c0-.45,0-.54,0-.63S6.49,2,6.39,2h-.1s0,0,0,0,0,0,.07,0h.8s.07,0,.07,0,0,0-.06,0H7c-.08,0-.11.06-.11.17s0,.18,0,.63V3.3c0,.38,0,.58.06.63s.13.07.36.07.27,0,.35-.08a.58.58,0,0,0,.08-.18s0-.05,0-.05,0,0,0,.05A2.55,2.55,0,0,1,7.75,4.08Z" />
                                            </g>
                                          </g>
                                        </svg>
                                      ) : (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 12 7.8"
                                          className="w-[30px] h-[30px] fill-[#ffffff]"
                                        >
                                          <title>SCREENAsset 6mdpi</title>
                                          <g id="Layer_2" data-name="Layer 2">
                                            <g
                                              id="Layer_1-2"
                                              data-name="Layer 1"
                                            >
                                              <path d="M1.73,2.38a12.63,12.63,0,0,1,1.21.89l.41.33a4.89,4.89,0,0,1-.1-.78L2.87,2.5,1.56,1.42a.19.19,0,0,1-.05-.09C1.36.52,0,.47,0,.47S.22,1.78,1.06,1.85A.15.15,0,0,1,1.2,2c0,.43.1.49.17.58a.45.45,0,0,1,.07.18,5.86,5.86,0,0,0,1,2.82,1.89,1.89,0,0,1,0-.43.11.11,0,0,1,.11-.09l.15,0a5.65,5.65,0,0,1-.91-1.82,4.15,4.15,0,0,1,.66,1.08A.56.56,0,0,1,3,4.45c0-.66-.62-1.27-1-1.67A1.17,1.17,0,0,1,1.73,2.38Zm1,.34C2.38,2.5,2,2.28,2,2.08,2.3,2.08,2.53,2.34,2.75,2.72ZM.4.8c.42.09.71.28.74.69C.85,1.57.65,1,.4.8Z" />
                                              <path d="M10.55,1.09a.13.13,0,0,1-.05.09L9.33,2.29,9,2.64a7,7,0,0,1-.1.83l.41-.38a10.58,10.58,0,0,1,1.12-.94,1.3,1.3,0,0,1-.22.42C9.85,3,9.27,3.64,9.32,4.3a.55.55,0,0,1,.41-.19A4.29,4.29,0,0,1,10.33,3a5.87,5.87,0,0,1-.8,1.87h.15A.11.11,0,0,1,9.8,5a1.73,1.73,0,0,1,0,.42,5.82,5.82,0,0,0,.86-2.88.64.64,0,0,1,.06-.18c.07-.1.15-.16.14-.59A.14.14,0,0,1,11,1.58c.83-.12,1-1.45,1-1.45S10.65.27,10.55,1.09ZM9.41,2.55c.19-.39.4-.66.66-.68C10.11,2.07,9.76,2.31,9.41,2.55Zm1.52-1.32c0-.42.28-.63.7-.74C11.39.74,11.22,1.29,10.93,1.23Z" />
                                              <path d="M4,5.45a2.89,2.89,0,0,1-.21.28A8.55,8.55,0,0,1,1.76,7.57a14.88,14.88,0,0,1,2-1.94L4,5.42a2.12,2.12,0,0,1-.11-.21l-.24.23-2,1.9V7.8H2L4,5.93l.24-.22A2.33,2.33,0,0,1,4,5.45Z" />
                                              <path d="M8.07,5.66a8.81,8.81,0,0,1,2.2,1.57A9.65,9.65,0,0,1,8.07,5.66Zm.36,0-.27-.19a4.38,4.38,0,0,1-.28.42l.27.2,2,1.39h.39V7.05Z" />
                                              <path d="M4,5.42l-.24.21.05.1A2.89,2.89,0,0,0,4,5.45ZM9.25.64A6.73,6.73,0,0,1,6.13,0,6.54,6.54,0,0,1,2.94.64a8.82,8.82,0,0,0-.08,1.58,2.53,2.53,0,0,0,0,.28,6.12,6.12,0,0,0,.07.77,6,6,0,0,0,.73,2.17l.11.19.05.1a2.43,2.43,0,0,1,.14.2A4.78,4.78,0,0,0,6.05,7.71h.1A4.81,4.81,0,0,0,8.15,6c.1-.14.19-.28.28-.43a6.14,6.14,0,0,0,.85-2.52,5.13,5.13,0,0,0,.05-.8.17.17,0,0,0,0-.07A7.76,7.76,0,0,0,9.25.64ZM8.87,3.47a5.59,5.59,0,0,1-.71,1.95,4.38,4.38,0,0,1-.28.42,4.47,4.47,0,0,1-1.81,1.5A4.34,4.34,0,0,1,4.21,5.71,2.33,2.33,0,0,1,4,5.45l0,0a2.12,2.12,0,0,1-.11-.21A5.63,5.63,0,0,1,3.35,3.6a4.89,4.89,0,0,1-.1-.78,5.74,5.74,0,0,1,0-.6c0-.36,0-.9,0-1.23A7.2,7.2,0,0,0,6.14.4,7.31,7.31,0,0,0,9,1c0,.33,0,.87,0,1.23,0,.14,0,.28,0,.42A7,7,0,0,1,8.87,3.47Z" />
                                              <path d="M7.25,5.2c0,.11-.06.14-.32.14l-.85,0H4.84c-.07,0-.1,0-.1-.05s0,0,.08,0l.18,0c.1,0,.13-.13.15-.27s0-.61,0-1.07V3c0-.77,0-.91,0-1.07s0-.25-.21-.28l-.17,0c-.06,0-.08,0-.08,0s0-.05.11-.05l.68,0,.68,0c.07,0,.11,0,.11.05s0,0-.09,0l-.2,0c-.13,0-.17.11-.18.28s0,.3,0,1.07v.88c0,.64,0,1,.1,1.08s.22.11.61.11a.8.8,0,0,0,.59-.14.67.67,0,0,0,.13-.3s0-.08,0-.08,0,0,0,.08A3.74,3.74,0,0,1,7.25,5.2Z" />
                                              <path d="M7.75,4.08c0,.07,0,.09-.19.09H6.33s-.06,0-.06,0,0,0,0,0h.11c.06,0,.08-.08.09-.16s0-.36,0-.63V2.78c0-.45,0-.54,0-.63S6.49,2,6.39,2h-.1s0,0,0,0,0,0,.07,0h.8s.07,0,.07,0,0,0-.06,0H7c-.08,0-.11.06-.11.17s0,.18,0,.63V3.3c0,.38,0,.58.06.63s.13.07.36.07.27,0,.35-.08a.58.58,0,0,0,.08-.18s0-.05,0-.05,0,0,0,.05A2.55,2.55,0,0,1,7.75,4.08Z" />
                                            </g>
                                          </g>
                                        </svg>
                                      )}
                                      Michael
                                    </>
                                  )}
                                </p>
                              )}

                              <p className="whitespace-pre-line leading-relaxed">
                                {msg.message}
                              </p>

                              <p className="text-[10px] text-[var(--chat-user-text)] text-right mt-2">
                                {new Date(msg.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveAvatar;
