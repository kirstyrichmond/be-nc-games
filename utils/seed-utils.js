exports.formatCategories = (categoryData) => {
  return categoryData.map((category) => {
    const { slug, description } = category;

    return [slug, description];
  });
};

exports.formatUsers = (userData) => {
  return userData.map((user) => {
    const { username, name, avatar_url } = user;
    return [username, name, avatar_url];
  });
};

exports.formatReviews = (reviewData) => {
  return reviewData.map((review) => {
    const {
      title,
      category,
      owner,
      review_body,
      designer,
      review_img_url,
      votes,
      created_at,
    } = review;
    return [
      title,
      category,
      owner,
      review_body,
      designer,
      review_img_url,
      votes,
      created_at,
    ];
  });
};

exports.formatComments = (commentData) => {
  return commentData.map((comment) => {
    const { author, review_id, body, votes, created_at } = comment;
    return [author, review_id, body, votes, created_at];
  });
};
