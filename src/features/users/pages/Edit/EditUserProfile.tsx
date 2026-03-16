import { useUserStore } from "@/features/users/store/userStore";
import PixelFrame from "@/components/PixelFrame";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const EditUserProfile = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const [username, setUsername] = useState(user.username);
  const [title, setTitle] = useState(user.title);
  const [githubUrl, setGithubUrl] = useState(user.githubUrl || "");
  const [skills, setSkills] = useState<string[]>(user.skills || []);
  const [newSkill, setNewSkill] = useState("");


  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        username,
        title,
        githubUrl,
        skills,
      });
    }
    console.log("Profile Updated!");
    navigate(-1);
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="font-pixel text-[8px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {"< CANCEL"}
        </button>

        <h1 className="font-pixel text-[12px] text-foreground pixel-text-shadow">
          EDIT ADVENTURER
        </h1>
      </div>

      <PixelFrame className="mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6 py-2">

          <div className="flex-1 w-full space-y-4">
            <div>
              <label className="font-pixel text-[8px] text-accent block mb-1">
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-secondary pixel-border p-2 font-pixel text-[10px] text-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="font-pixel text-[8px] text-accent block mb-1">
                ADVENTURER TITLE
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-secondary pixel-border p-2 font-pixel text-[10px] text-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>
      </PixelFrame>

      <PixelFrame className="mb-6">
        <h2 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">
          ⚔ Edit Skills
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill) => (
            <span
              key={skill}
              className="pixel-border bg-secondary px-3 py-1 font-pixel text-[8px] text-foreground flex items-center gap-2"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="text-accent hover:text-red-500 font-bold ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add new skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            className="flex-1 bg-secondary pixel-border p-2 font-pixel text-[8px] text-foreground focus:outline-none"
          />
          <button
            onClick={addSkill}
            className="pixel-border bg-muted px-4 font-pixel text-[8px] text-foreground"
          >
            ADD
          </button>
        </div>
      </PixelFrame>

      <PixelFrame className="mb-6">
        <h2 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">
          🔗 GitHub URL
        </h2>
        <input
          type="text"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/username"
          className="w-full bg-secondary pixel-border p-3 font-pixel text-[10px] text-accent focus:outline-none"
        />
      </PixelFrame>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleSave}
          className="pixel-border bg-secondary hover:bg-muted w-full sm:w-64 py-4 font-pixel text-[10px] text-accent pixel-text-shadow transition-all"
        >
          CONFIRM UPDATES
        </button>
      </div>
    </div>
  );
};

export default EditUserProfile;
