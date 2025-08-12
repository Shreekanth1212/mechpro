import React, { useState, useEffect } from "react";
import axios from "axios";
import ReviewSubfield from "./ReviewSubfield";

export default function ReviewWork({ project, goBack }) {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    fetchProjectData();
  }, []);

  const fetchProjectData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/projects/${project.id}`);
      setFields(res.data.fields || []);
    } catch (err) {
      console.error("Error fetching project for review:", err);
    }
  };

  const updateSubfield = async (fieldId, subfieldId, updatedData) => {
    try {
      // Fetch latest project to avoid overwrites
      const res = await axios.get(`http://localhost:5000/projects/${project.id}`);
      const updatedFields = res.data.fields.map(field =>
        field.id === fieldId
          ? {
              ...field,
              subfields: field.subfields.map(sf =>
                sf.id === subfieldId ? { ...sf, ...updatedData } : sf
              ),
            }
          : field
      );

      await axios.put(`http://localhost:5000/projects/${project.id}`, {
        ...res.data,
        fields: updatedFields,
      });

      setFields(updatedFields);
    } catch (err) {
      console.error("Error updating subfield in review:", err);
    }
  };

  return (
    <div className="pms-review-container">
      <h2>Review Work for {project.name}</h2>
      <button onClick={goBack}>⬅ Back</button>
      {fields.map(field => (
        <div key={field.id} className="pms-field-review">
          <h3>{field.name}</h3>
          {field.subfields.map(subfield => (
            <ReviewSubfield
              key={subfield.id}
              fieldId={field.id}
              subfield={subfield}
              onUpdate={updateSubfield}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
