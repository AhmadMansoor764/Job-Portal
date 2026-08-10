import User from "../model/User.js";
import mongoose from "mongoose";
import supabase from "../config/supabase.js";
import crypto from "crypto";
import Job from "../model/Job.js";

// =====================================================
// UPLOAD PROFILE IMAGE
// =====================================================
// =====================================================
// UPLOAD / REPLACE PROFILE IMAGE
// =====================================================

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const file = req.file;

    // =====================================================
    // DELETE OLD PROFILE IMAGE
    // =====================================================

    if (user.profileImage) {
      try {
        const imageUrl = user.profileImage;

        // Get everything after /avatars/
        const bucketPath = "/storage/v1/object/public/avatars/";

        const index = imageUrl.indexOf(bucketPath);

        if (index !== -1) {
          const oldFilePath = imageUrl.substring(index + bucketPath.length);

          if (oldFilePath) {
            const { error: deleteError } = await supabase.storage
              .from("avatars")
              .remove([oldFilePath]);

            if (deleteError) {
              console.error("Failed to delete old profile image:", deleteError);
            } else {
              console.log("Old profile image deleted:", oldFilePath);
            }
          }
        }
      } catch (deleteError) {
        console.error("Old image deletion error:", deleteError);

        // Don't stop the upload if deleting the old image fails.
      }
    }

    // =====================================================
    // CREATE NEW FILE NAME
    // =====================================================

    const fileExtension = file.originalname.split(".").pop().toLowerCase();

    const fileName = `${req.user.id}-${Date.now()}.${fileExtension}`;

    const filePath = `profile-images/${fileName}`;

    // =====================================================
    // UPLOAD NEW IMAGE
    // =====================================================

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);

      return res.status(500).json({
        success: false,
        message: "Failed to upload image",
      });
    }

    // =====================================================
    // GET PUBLIC URL
    // =====================================================

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const imageUrl = data.publicUrl;

    // =====================================================
    // SAVE NEW URL TO USER
    // =====================================================

    user.profileImage = imageUrl;

    await user.save();

    // =====================================================
    // UPDATE EMPLOYER JOB LOGOS
    // =====================================================

    if (user.role === "employer") {
      await Job.updateMany(
        {
          employer: user._id,
        },
        {
          $set: {
            companyLogo: imageUrl,
          },
        },
      );
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      profileImage: imageUrl,
    });
  } catch (error) {
    console.error("Upload profile image error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile image",
    });
  }
};

// =====================================================
// DELETE PROFILE IMAGE
// =====================================================

export const deleteProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // No profile image
    if (!user.profileImage) {
      return res.status(200).json({
        success: true,
        message: "No profile image was set",
        profileImage: "",
      });
    }

    const imageUrl = user.profileImage;

    // =====================================================
    // DELETE SUPABASE IMAGE
    // =====================================================

    const bucketPath = "/storage/v1/object/public/avatars/";

    if (imageUrl.includes(bucketPath)) {
      const oldFilePath = imageUrl.split(bucketPath)[1];

      if (oldFilePath) {
        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove([oldFilePath]);

        if (deleteError) {
          console.error("Supabase delete error:", deleteError);

          return res.status(500).json({
            success: false,
            message: "Failed to delete profile image",
          });
        }
      }
    }

    // =====================================================
    // REMOVE IMAGE FROM MONGODB
    // =====================================================

    user.profileImage = "";

    await user.save();

    // =====================================================
    // REMOVE EMPLOYER LOGO
    // =====================================================

    if (user.role === "employer") {
      await Job.updateMany(
        {
          employer: user._id,
        },
        {
          $set: {
            companyLogo: "",
          },
        },
      );
    }

    return res.status(200).json({
      success: true,
      message: "Profile image removed successfully",
      profileImage: "",
    });
  } catch (error) {
    console.error("Delete profile image error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove profile image",
    });
  }
};

// get profile

// =====================================================
// GET MY PROFILE
// =====================================================

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};
// =====================================================
// GET MY PROJECTS
// =====================================================

export const getMyProjects = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("projects");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      projects: user.projects || [],
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

// =====================================================
// ADD PROJECT
// =====================================================

export const addProject = async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      liveUrl,
      githubUrl,
      startDate,
      endDate,
      currentlyWorking,
    } = req.body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Project title and description are required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------------------------
    // CREATE PROJECT
    // -----------------------------------------------

    user.projects.push({
      title,
      description,
      technologies: technologies || [],
      liveUrl: liveUrl || "",
      githubUrl: githubUrl || "",
      startDate: startDate || "",
      endDate: endDate || "",
      currentlyWorking: Boolean(currentlyWorking),
    });

    await user.save();

    // Get the newly created project
    const newProject = user.projects[user.projects.length - 1];

    return res.status(201).json({
      success: true,
      message: "Project added successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Add project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add project",
    });
  }
};

// =====================================================
// UPDATE PROJECT
// =====================================================

export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const {
      title,
      description,
      technologies,
      liveUrl,
      githubUrl,
      startDate,
      endDate,
      currentlyWorking,
    } = req.body;

    // -----------------------------------------------
    // VALIDATE PROJECT ID
    // -----------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    // -----------------------------------------------
    // FIND USER
    // -----------------------------------------------

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------------------------
    // FIND PROJECT
    // -----------------------------------------------

    const project = user.projects.id(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // -----------------------------------------------
    // UPDATE PROJECT
    // -----------------------------------------------

    project.title = title;
    project.description = description;
    project.technologies = technologies || [];
    project.liveUrl = liveUrl || "";
    project.githubUrl = githubUrl || "";
    project.startDate = startDate || "";
    project.endDate = endDate || "";
    project.currentlyWorking = Boolean(currentlyWorking);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

// =====================================================
// DELETE PROJECT
// =====================================================

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // -----------------------------------------------
    // VALIDATE PROJECT ID
    // -----------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    // -----------------------------------------------
    // FIND USER
    // -----------------------------------------------

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------------------------
    // FIND PROJECT
    // -----------------------------------------------

    const project = user.projects.id(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // -----------------------------------------------
    // DELETE
    // -----------------------------------------------

    project.deleteOne();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};

// =====================================================
// GET MY SKILLS
// =====================================================

export const getMySkills = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("skills");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      skills: user.skills || [],
    });
  } catch (error) {
    console.error("Get skills error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
    });
  }
};

// =====================================================
// UPDATE MY SKILLS
// =====================================================

export const updateMySkills = async (req, res) => {
  try {
    const { skills } = req.body;

    // -----------------------------------------------
    // VALIDATE ARRAY
    // -----------------------------------------------

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: "Skills must be an array",
      });
    }

    // -----------------------------------------------
    // CLEAN SKILLS
    // -----------------------------------------------

    const cleanedSkills = skills
      .filter((skill) => typeof skill === "string")
      .map((skill) => skill.trim())
      .filter(Boolean)
      .map((skill) => skill.slice(0, 50));

    // -----------------------------------------------
    // LIMIT NUMBER OF SKILLS
    // -----------------------------------------------

    if (cleanedSkills.length > 50) {
      return res.status(400).json({
        success: false,
        message: "You can add a maximum of 50 skills",
      });
    }

    // -----------------------------------------------
    // REMOVE DUPLICATES
    // -----------------------------------------------

    const uniqueSkills = [
      ...new Map(
        cleanedSkills.map((skill) => [skill.toLowerCase(), skill]),
      ).values(),
    ];

    // -----------------------------------------------
    // UPDATE USER
    // -----------------------------------------------

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        skills: uniqueSkills,
      },
      {
        new: true,
      },
    ).select("skills");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skills updated successfully",
      skills: user.skills,
    });
  } catch (error) {
    console.error("Update skills error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update skills",
    });
  }
};

// =====================================================
// GET MY EXPERIENCE
// =====================================================

export const getMyExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("experience");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      experience: user.experience || [],
    });
  } catch (error) {
    console.error("Get experience error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch experience",
    });
  }
};

// =====================================================
// ADD EXPERIENCE
// =====================================================

export const addExperience = async (req, res) => {
  try {
    const {
      jobTitle,
      company,
      location,
      startDate,
      endDate,
      currentlyWorking,
      description,
    } = req.body;

    // -----------------------------------------------
    // REQUIRED FIELDS
    // -----------------------------------------------

    if (!jobTitle || !company || !startDate || !description) {
      return res.status(400).json({
        success: false,
        message: "Job title, company, start date, and description are required",
      });
    }

    // -----------------------------------------------
    // VALIDATE START DATE
    // -----------------------------------------------

    const parsedStartDate = new Date(startDate);

    if (Number.isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date",
      });
    }

    // -----------------------------------------------
    // VALIDATE END DATE
    // -----------------------------------------------

    let parsedEndDate = null;

    if (!currentlyWorking && endDate) {
      parsedEndDate = new Date(endDate);

      if (Number.isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid end date",
        });
      }

      // End date cannot be before start date
      if (parsedEndDate < parsedStartDate) {
        return res.status(400).json({
          success: false,
          message: "End date cannot be before start date",
        });
      }
    }

    // -----------------------------------------------
    // FIND USER
    // -----------------------------------------------

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------------------------
    // ADD EXPERIENCE
    // -----------------------------------------------

    user.experience.push({
      jobTitle: jobTitle.trim(),
      company: company.trim(),
      location: location?.trim() || "",
      startDate: parsedStartDate,
      endDate: currentlyWorking ? null : parsedEndDate,
      currentlyWorking: Boolean(currentlyWorking),
      description: description.trim(),
    });

    await user.save();

    const newExperience = user.experience[user.experience.length - 1];

    return res.status(201).json({
      success: true,
      message: "Experience added successfully",
      experience: newExperience,
    });
  } catch (error) {
    console.error("Add experience error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add experience",
    });
  }
};

// =====================================================
// UPDATE EXPERIENCE
// =====================================================

export const updateExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;

    const {
      jobTitle,
      company,
      location,
      startDate,
      endDate,
      currentlyWorking,
      description,
    } = req.body;

    // -----------------------------------------------
    // VALIDATE EXPERIENCE ID
    // -----------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(experienceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid experience ID",
      });
    }

    // -----------------------------------------------
    // REQUIRED FIELDS
    // -----------------------------------------------

    if (!jobTitle || !company || !startDate || !description) {
      return res.status(400).json({
        success: false,
        message: "Job title, company, start date, and description are required",
      });
    }

    // -----------------------------------------------
    // VALIDATE START DATE
    // -----------------------------------------------

    const parsedStartDate = new Date(startDate);

    if (Number.isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date",
      });
    }

    // -----------------------------------------------
    // VALIDATE END DATE
    // -----------------------------------------------

    let parsedEndDate = null;

    if (!currentlyWorking && endDate) {
      parsedEndDate = new Date(endDate);

      if (Number.isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid end date",
        });
      }

      if (parsedEndDate < parsedStartDate) {
        return res.status(400).json({
          success: false,
          message: "End date cannot be before start date",
        });
      }
    }

    // -----------------------------------------------
    // FIND USER
    // -----------------------------------------------

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------------------------
    // FIND EXPERIENCE
    // -----------------------------------------------

    const experience = user.experience.id(experienceId);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    // -----------------------------------------------
    // UPDATE EXPERIENCE
    // -----------------------------------------------

    experience.jobTitle = jobTitle.trim();
    experience.company = company.trim();
    experience.location = location?.trim() || "";
    experience.startDate = parsedStartDate;
    experience.endDate = currentlyWorking ? null : parsedEndDate;
    experience.currentlyWorking = Boolean(currentlyWorking);
    experience.description = description.trim();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      experience,
    });
  } catch (error) {
    console.error("Update experience error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update experience",
    });
  }
};

// =====================================================
// DELETE EXPERIENCE
// =====================================================

export const deleteExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(experienceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid experience ID",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const experience = user.experience.id(experienceId);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    experience.deleteOne();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Delete experience error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete experience",
    });
  }
};
// =====================================================
// GET MY EDUCATION
// =====================================================

export const getMyEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("education");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      education: user.education || [],
    });
  } catch (error) {
    console.error("Get education error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch education",
    });
  }
};

// =====================================================
// ADD EDUCATION
// =====================================================

export const addEducation = async (req, res) => {
  try {
    const {
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      currentlyStudying,
    } = req.body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (!institution || !degree || !fieldOfStudy) {
      return res.status(400).json({
        success: false,
        message: "Institution, degree, and field of study are required",
      });
    }

    // -----------------------------------------------
    // FIND USER
    // -----------------------------------------------

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------------------------
    // ADD EDUCATION
    // -----------------------------------------------

    user.education.push({
      institution,
      degree,
      fieldOfStudy,
      startDate: startDate || null,
      endDate: currentlyStudying ? null : endDate || null,
      currentlyStudying: Boolean(currentlyStudying),
    });

    await user.save();

    const newEducation = user.education[user.education.length - 1];

    return res.status(201).json({
      success: true,
      message: "Education added successfully",
      education: newEducation,
    });
  } catch (error) {
    console.error("Add education error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add education",
    });
  }
};

// =====================================================
// UPDATE EDUCATION
// =====================================================

export const updateEducation = async (req, res) => {
  try {
    const { educationId } = req.params;

    const {
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      currentlyStudying,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(educationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid education ID",
      });
    }

    // -----------------------------------------------
    // FIND USER
    // -----------------------------------------------

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------------------------
    // FIND EDUCATION
    // -----------------------------------------------

    const education = user.education.id(educationId);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education record not found",
      });
    }

    // -----------------------------------------------
    // UPDATE
    // -----------------------------------------------

    education.institution = institution;
    education.degree = degree;
    education.fieldOfStudy = fieldOfStudy;
    education.startDate = startDate || null;
    education.endDate = currentlyStudying ? null : endDate || null;
    education.currentlyStudying = Boolean(currentlyStudying);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Education updated successfully",
      education,
    });
  } catch (error) {
    console.error("Update education error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update education",
    });
  }
};

// =====================================================
// DELETE EDUCATION
// =====================================================

export const deleteEducation = async (req, res) => {
  try {
    const { educationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(educationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid education ID",
      });
    }

    // -----------------------------------------------
    // FIND USER
    // -----------------------------------------------

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------------------------
    // FIND EDUCATION
    // -----------------------------------------------

    const education = user.education.id(educationId);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: "Education record not found",
      });
    }

    // -----------------------------------------------
    // DELETE
    // -----------------------------------------------

    education.deleteOne();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    console.error("Delete education error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete education",
    });
  }
};

// =====================================================
// GET BASIC PROFILE
// =====================================================

export const getBasicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email phone location profileImage headline bio role",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile: user,
    });
  } catch (error) {
    console.error("Get basic profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// =====================================================
// UPDATE BASIC PROFILE
// =====================================================

export const updateBasicProfile = async (req, res) => {
  try {
    const { phone, location, headline, bio } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update only fields that were provided
    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (location !== undefined) {
      user.location = location.trim();
    }

    if (headline !== undefined) {
      user.headline = headline.trim();
    }

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        profileImage: user.profileImage,
        headline: user.headline,
        bio: user.bio,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update basic profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// =====================================================
// GET PROFESSIONAL LINKS
// =====================================================

export const getProfessionalLinks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "linkedinUrl githubUrl portfolioUrl",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      links: {
        linkedinUrl: user.linkedinUrl || "",
        githubUrl: user.githubUrl || "",
        portfolioUrl: user.portfolioUrl || "",
      },
    });
  } catch (error) {
    console.error("Get professional links error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch professional links",
    });
  }
};

// =====================================================
// UPDATE PROFESSIONAL LINKS
// =====================================================

export const updateProfessionalLinks = async (req, res) => {
  try {
    const { linkedinUrl, githubUrl, portfolioUrl } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.linkedinUrl = linkedinUrl || "";
    user.githubUrl = githubUrl || "";
    user.portfolioUrl = portfolioUrl || "";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Professional links updated successfully",
      links: {
        linkedinUrl: user.linkedinUrl,
        githubUrl: user.githubUrl,
        portfolioUrl: user.portfolioUrl,
      },
    });
  } catch (error) {
    console.error("Update professional links error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update professional links",
    });
  }
};

// =====================================================
// UPLOAD / REPLACE RESUME
// =====================================================

export const uploadResume = async (req, res) => {
  try {
    // -------------------------------------------------
    // CHECK FILE
    // -------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No CV uploaded",
      });
    }

    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const file = req.file;

    // -------------------------------------------------
    // DELETE OLD RESUME
    // -------------------------------------------------

    if (user.resume?.publicId) {
      try {
        const { error: deleteError } = await supabase.storage
          .from("profile-cv")
          .remove([user.resume.publicId]);

        if (deleteError) {
          console.error("Failed to delete old resume:", deleteError);
        } else {
          console.log("Old resume deleted:", user.resume.publicId);
        }
      } catch (deleteError) {
        console.error("Old resume deletion error:", deleteError);

        // Don't stop the new upload if old deletion fails.
      }
    }

    // -------------------------------------------------
    // CREATE NEW FILE NAME
    // -------------------------------------------------

    const fileName = `${req.user.id}-${Date.now()}.pdf`;

    const filePath = `resumes/${fileName}`;

    // -------------------------------------------------
    // UPLOAD NEW RESUME
    // -------------------------------------------------

    const { error: uploadError } = await supabase.storage
      .from("profile-cv")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase resume upload error:", uploadError);

      return res.status(500).json({
        success: false,
        message: "Failed to upload CV",
      });
    }

    // -------------------------------------------------
    // GET PUBLIC URL
    // -------------------------------------------------

    const { data } = supabase.storage.from("profile-cv").getPublicUrl(filePath);

    const resumeUrl = data.publicUrl;

    // -------------------------------------------------
    // SAVE RESUME INFORMATION
    // -------------------------------------------------

    user.resume = {
      url: resumeUrl,
      fileName: file.originalname,
      publicId: filePath,
    };

    await user.save();

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "CV uploaded successfully",
      resume: user.resume,
    });
  } catch (error) {
    console.error("Upload resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload CV",
    });
  }
};

// =====================================================
// DELETE RESUME
// =====================================================

export const deleteResume = async (req, res) => {
  try {
    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -------------------------------------------------
    // CHECK RESUME
    // -------------------------------------------------

    if (!user.resume?.publicId) {
      return res.status(200).json({
        success: true,
        message: "No CV was uploaded",
      });
    }

    // -------------------------------------------------
    // DELETE FROM SUPABASE
    // -------------------------------------------------

    const { error: deleteError } = await supabase.storage
      .from("profile-cv")
      .remove([user.resume.publicId]);

    if (deleteError) {
      console.error("Supabase resume delete error:", deleteError);

      return res.status(500).json({
        success: false,
        message: "Failed to delete CV",
      });
    }

    // -------------------------------------------------
    // REMOVE FROM MONGODB
    // -------------------------------------------------

    user.resume = undefined;

    await user.save();

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "CV deleted successfully",
    });
  } catch (error) {
    console.error("Delete resume error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete CV",
    });
  }
};

export const getJobSeekerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await User.findById(id).select(
      "name profileImage headline bio location skills experience education projects linkedinUrl githubUrl portfolioUrl resume",
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Job seeker not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: candidate,
    });
  } catch (error) {
    console.error("Get job seeker profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load job seeker profile",
    });
  }
};

// =====================================================
// GET EMPLOYER PROFILE
// =====================================================

export const getEmployerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email phone location role profileImage companyTagline bio companyIndustry companyType companySize foundedYear websiteUrl linkedinUrl",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
      });
    }

    if (user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Only employers can access this profile",
      });
    }

    return res.status(200).json({
      success: true,
      profile: user,
    });
  } catch (error) {
    console.error("Get employer profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch employer profile",
    });
  }
};

// =====================================================
// UPDATE EMPLOYER PROFILE
// =====================================================

export const updateEmployerProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      companyTagline,
      bio,
      companyIndustry,
      companyType,
      companySize,
      foundedYear,
      websiteUrl,
      linkedinUrl,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employer not found",
      });
    }

    if (user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Only employers can update an employer profile",
      });
    }

    // =====================================================
    // BASIC INFORMATION
    // =====================================================

    if (name !== undefined) {
      const cleanedName = name.trim();

      if (!cleanedName) {
        return res.status(400).json({
          success: false,
          message: "Company name is required",
        });
      }

      user.name = cleanedName;
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (location !== undefined) {
      user.location = location.trim();
    }

    // =====================================================
    // COMPANY INFORMATION
    // =====================================================

    if (companyTagline !== undefined) {
      user.companyTagline = companyTagline.trim();
    }

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    if (companyIndustry !== undefined) {
      user.companyIndustry = companyIndustry.trim();
    }

    if (companyType !== undefined) {
      user.companyType = companyType.trim();
    }

    if (companySize !== undefined) {
      user.companySize = companySize || undefined;
    }

    // =====================================================
    // FOUNDED YEAR
    // =====================================================

    if (foundedYear !== undefined && foundedYear !== "") {
      const year = Number(foundedYear);

      if (
        !Number.isInteger(year) ||
        year < 1800 ||
        year > new Date().getFullYear()
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid founded year",
        });
      }

      user.foundedYear = year;
    } else if (foundedYear === "") {
      user.foundedYear = undefined;
    }

    // =====================================================
    // ONLINE PRESENCE
    // =====================================================

    if (websiteUrl !== undefined) {
      user.websiteUrl = websiteUrl.trim();
    }

    if (linkedinUrl !== undefined) {
      user.linkedinUrl = linkedinUrl.trim();
    }

    // =====================================================
    // SAVE
    // =====================================================

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Company profile updated successfully",

      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
        profileImage: user.profileImage,

        companyTagline: user.companyTagline,
        bio: user.bio,
        companyIndustry: user.companyIndustry,
        companyType: user.companyType,
        companySize: user.companySize,
        foundedYear: user.foundedYear,

        websiteUrl: user.websiteUrl,
        linkedinUrl: user.linkedinUrl,
      },
    });
  } catch (error) {
    console.error("Update employer profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update employer profile",
    });
  }
};
