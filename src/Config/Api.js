// src/Config/Api.js
const API_BASE = import.meta.env.VITE_API_URL;

const API = {
  // ADMIN
  ADMIN_SEND_TELEGRAM: `${API_BASE}/admin/send-telegram.php`,

  // ARTICLE
  ARTICLE_LIST: `${API_BASE}/article/get-article.php`, // GET list artikel
  ARTICLE_DETAIL: (id) => `${API_BASE}/article/get-article-detail.php?id=${id}`, // GET detail artikel
  ARTICLE_SAVE: `${API_BASE}/article/articles.php`, // POST create / PUT update artikel
  ARTICLE_COMMENTS: `${API_BASE}/article/comments.php`,
  ARTICLE_LIKE_COUNT: `${API_BASE}/article/get-like-counts.php`,
  ARTICLE_REACTIONS: `${API_BASE}/article/reaction-counts.php`,
  ARTICLE_TOGGLE_LIKE: `${API_BASE}/article/toggle-like.php`,
  ARTICLE_UPLOAD_IMAGE: `${API_BASE}/article/upload-article-image.php`,

  // AUTH-USER
  AUTH_GOOGLE: `${API_BASE}/auth-user/auth-google.php`,
  AUTH_LOGIN: `${API_BASE}/auth-user/login.php`,
  AUTH_REGISTER_OTP: `${API_BASE}/auth-user/register-send-otp.php`,
  AUTH_RESEND_OTP: `${API_BASE}/auth-user/resend-otp.php`,
  AUTH_VERIFY_OTP: `${API_BASE}/auth-user/verify-otp.php`,

  // CHAT
  CHAT_CREATE_ROOM: `${API_BASE}/chat/create-room.php`,
  CHAT_DELETE_ROOM: `${API_BASE}/chat/delete-room.php`,
  CHAT_GET_MESSAGES: `${API_BASE}/chat/get-messages.php`,
  CHAT_GET_ROOMS: `${API_BASE}/chat/get-rooms.php`,
  CHAT_SEND_MESSAGE: `${API_BASE}/chat/send-message.php`,

  // CONFIG
  CONFIG_HUBUNGAN: `${API_BASE}/config/hubungan.php`,

  // NOTIFICATION
  NOTIFICATION_LIST: `${API_BASE}/notification/get-notifications.php`,
  NOTIFICATION_MARK_READ: `${API_BASE}/notification/mark-read.php`,

  // PERSONALITY
  PERSONALITY_ANSWERS: `${API_BASE}/personality/personality-answers.php`,
  PERSONALITY_QUESTIONS: `${API_BASE}/personality/personality-questions.php`,
  PERSONALITY_RESULTS: `${API_BASE}/personality/personality-results.php`,
  PERSONALITY_TYPE: `${API_BASE}/personality/personality-type.php`,

  // PROFILE
  PROFILE_DELETE: `${API_BASE}/profile/delete-profile.php`,
  PROFILE_EDIT_CERTIFICATE: `${API_BASE}/profile/edit-certificate.php`,
  PROFILE_EDIT_CONTACT: `${API_BASE}/profile/edit-contact.php`,
  PROFILE_EDIT_EDUCATIONS: `${API_BASE}/profile/edit-education.php`,
  PROFILE_EDIT_EXPERIENCE: `${API_BASE}/profile/edit-experience.php`,
  PROFILE_EDIT_LANGUAGE: `${API_BASE}/profile/edit-language.php`,
  PROFILE_EDIT_PROFILE: `${API_BASE}/profile/edit-profile.php`,
  PROFILE_EDIT_PROJECT: `${API_BASE}/profile/edit-project.php`,
  PROFILE_EDIT_SKILL: `${API_BASE}/profile/edit-skill.php`,
  PROFILE_GET: `${API_BASE}/profile/get-profile.php`,
  PROFILE_UPLOAD_IMAGE: `${API_BASE}/profile/upload-image.php`,

  // USER
  USER_BLOCK_STATUS: `${API_BASE}/user/block-status.php`,
  USER_CONNECTIONS: `${API_BASE}/user/connections.php`,
  USER_FOLLOW_STATUS: `${API_BASE}/user/follow-status.php`,
  USER_SEARCH: `${API_BASE}/user/search-user.php`,
  USER_TOGGLE_BLOCK: `${API_BASE}/user/toggle-block.php`,
  USER_TOGGLE_FOLLOW: `${API_BASE}/user/toggle-follow.php`,
};

export default API;
