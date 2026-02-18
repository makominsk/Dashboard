# Composio Documentation (Provided)

# Instagram

Instagram is a social media platform for sharing photos, videos, and stories. Only supports Instagram Business and Creator accounts, not Instagram Personal accounts.

- **Category:** social media accounts
- **Auth:** OAUTH2
- **Tools:** 32
- **Triggers:** 0
- **Slug:** `INSTAGRAM`
- **Version:** 20260211_00

## Tools

### Create Carousel Container

**Slug:** `INSTAGRAM_CREATE_CAROUSEL_CONTAINER`

Create a draft carousel post with multiple images/videos before publishing.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `caption` | string | No | Caption for the carousel post (maximum 2,200 characters) |
| `children` | array | No | List of child creation_ids (image/video items) |
| `ig_user_id` | string | Yes | Instagram Business Account ID |
| `child_image_urls` | array | No | List of image URLs to include as carousel children. Images must meet Instagram's requirements: JPEG format, aspect ratio between 4:5 (0.8) and 1.91:1, width between 320-1440px (images below 320px are scaled up, larger images are downscaled), maximum file size 8MB. URLs must be publicly accessible by Instagram's servers. |
| `child_video_urls` | array | No | List of video URLs to include as carousel children. Videos must meet Instagram's requirements: MP4 or MOV format, aspect ratio between 4:5 (0.8) and 1.91:1, duration 3-60 seconds, maximum file size 4GB. URLs must be publicly accessible by Instagram's servers. |
| `child_image_files` | array | No | List of local image files to include as carousel children. Images must meet Instagram's requirements: JPEG format, aspect ratio between 4:5 (0.8) and 1.91:1, width between 320-1440px (images below 320px are scaled up, larger images are downscaled), maximum file size 8MB. |
| `child_video_files` | array | No | List of local video files to include as carousel children. Videos must meet Instagram's requirements: MP4 or MOV format, aspect ratio between 4:5 (0.8) and 1.91:1, duration 3-60 seconds, maximum file size 4GB. |
| `graph_api_version` | string | No | Instagram Graph API version to use |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create Media Container

**Slug:** `INSTAGRAM_CREATE_MEDIA_CONTAINER`

Create a draft media container for photos/videos/reels before publishing.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `caption` | string | No | Post caption text. Maximum 2,200 characters. Hashtag limit: 30 hashtags maximum per post (Instagram enforces this limit). Mention limit: 20 @mentions maximum. |
| `cover_url` | string | No | Cover image URL for videos. For feed videos (content_type='video'), if image_url is not provided, this will be used as the required thumbnail. For reels, this is optional. |
| `image_url` | string | No | Public URL of the image. CRITICAL REQUIREMENTS: (1) Must be a DIRECT link to the raw image file - no redirects, no authentication, no HTML wrappers. (2) Must be publicly accessible by Meta's crawlers (URLs from Google Drive, dynamic API endpoints, or generated URLs like 'backend.composio.dev/dynamic-module-load/...' will NOT work). (3) Must return proper HTTP 200 status with correct Content-Type header (image/jpeg or image/png). (4) Supported formats: JPG, PNG (WebP not supported). Max 8MB, min 320px width, aspect ratio 4:5 to 1.91:1. RECOMMENDED: Use image hosting services like Imgur, Cloudinary, AWS S3 (public), or similar that provide direct download URLs. For feed videos (content_type='video'), this parameter is required as a thumbnail. |
| `video_url` | string | No | Public URL of the video. CRITICAL REQUIREMENTS: (1) Must be a DIRECT link to the raw video file - no redirects, no authentication, no HTML wrappers. (2) Must be publicly accessible by Meta's crawlers (URLs from Google Drive, dynamic API endpoints, or generated URLs will NOT work). (3) Must return proper HTTP 200 status with correct Content-Type header (video/mp4 or video/quicktime). (4) Supported formats: MP4, MOV. Max 100MB for feed videos, max 1GB for IGTV, min 3 seconds duration. RECOMMENDED: Use video hosting services or cloud storage like AWS S3 (public), Cloudinary, or similar. |
| `ig_user_id` | string | No | Instagram Business Account ID (numeric string like '17841400008460056'). Optional - defaults to the current authenticated user. Do NOT pass Composio connection IDs (starting with 'ca_') or other auth identifiers. |
| `media_type` | string | No | Explicit media type override (IMAGE, REELS, or CAROUSEL). If not provided, media_type is automatically inferred: IMAGE for image_url, REELS for video_url. IMPORTANT: Each media_type has specific URL requirements: IMAGE requires image_url; REELS requires video_url. NOTE: VIDEO media_type was deprecated on November 9, 2023. If VIDEO is provided, it will be automatically converted to REELS. |
| `content_type` | string ("photo" | "video" | "reel" | "carousel_item") | No | What you want to post: 'photo', 'video', 'reel', or 'carousel_item' (for carousel drafts) |
| `is_carousel_item` | boolean | No | Legacy parameter to mark media as a carousel item. Prefer using content_type='carousel_item' instead, which automatically sets this flag. When creating carousel items, you must provide either image_url or video_url. |
| `graph_api_version` | string | No | |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create Post

**Slug:** `INSTAGRAM_CREATE_POST`

Publish a draft media container to Instagram (final publishing step). IMPORTANT: After creating a media container, Instagram may need time to process the media before it can be published. If called immediately after container creation, you may receive error code 9007 ("The media is not ready for publishing"). This action automatically retries with exponential backoff (up to ~44 seconds total) to handle this processing delay. For large videos or slow processing, consider using INSTAGRAM_GET_POST_STATUS to poll the container status until it shows 'FINISHED' before calling this action.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ig_user_id` | string | Yes | Instagram Business Account ID. Must be a numeric string (e.g., '25162441193410545'). |
| `creation_id` | string | Yes | The media container ID returned in the 'id' field from INSTAGRAM_CREATE_MEDIA_CONTAINER or INSTAGRAM_CREATE_CAROUSEL_CONTAINER. Typically a long numeric string like '17895695668004550'. IMPORTANT: Do NOT use datetime strings (e.g., '2024-01-15T10:30:00+0000') - those are unrelated fields in Instagram responses. The container ID is found in the response like: {'id': '17895695668004550'}. |
| `graph_api_version` | string | No | |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete Comment

**Slug:** `INSTAGRAM_DELETE_COMMENT`

Tool to delete a comment on Instagram media. Use when you need to remove a comment that was created by your Instagram Business or Creator Account. Note: You can only delete comments that your account created - you cannot delete other users' comments unless they are on your own media.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ig_comment_id` | string | Yes | The unique identifier of the Instagram comment to delete. This must be a comment created by your Instagram Business or Creator Account. |
| `graph_api_version` | string | No | Instagram Graph API version to use. Defaults to v21.0. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Conversation

**Slug:** `INSTAGRAM_GET_CONVERSATION`

Get details about a specific Instagram DM conversation (participants, etc).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `conversation_id` | string | Yes | The unique identifier for the Instagram conversation thread. This is typically a base64-encoded string obtained from the list_conversations or list_all_conversations actions. Must not be empty or contain only whitespace. |
| `graph_api_version` | string | No | The Graph API version to use (e.g., 'v21.0'). Defaults to 'v21.0'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get IG Comment Replies

**Slug:** `INSTAGRAM_GET_IG_COMMENT_REPLIES`

Get replies to a specific Instagram comment. Returns a list of comment replies with details like text, username, timestamp, and like count. Use when you need to retrieve child comments (replies) for a specific parent comment.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Cursor for forward pagination - get replies after this cursor |
| `limit` | integer | No | Number of replies to return per page (max 100) |
| `before` | string | No | Cursor for backward pagination - get replies before this cursor |
| `fields` | string | No | Comma-separated list of fields to return. Available fields: id, text, username, timestamp, like_count, hidden, from, media, parent_id, replies, legacy_instagram_comment_id |
| `ig_comment_id` | string | Yes | Instagram Comment ID to get replies for |
| `graph_api_version` | string | No | Graph API version to use |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Instagram Media

**Slug:** `INSTAGRAM_GET_IG_MEDIA`

Get a published Instagram Media object (photo, video, story, reel, or carousel). Use when you need to retrieve detailed information about a specific Instagram post including engagement metrics, caption, media URLs, and metadata. NOTE: This action is for published media only. For unpublished container IDs (from INSTAGRAM_CREATE_MEDIA_CONTAINER), use INSTAGRAM_GET_POST_STATUS to check status instead.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fields` | string | No | Comma-separated list of fields to return. Defaults to 'id' only for maximum compatibility. Supported fields: id, caption, comments_count, is_comment_enabled, like_count, media_type, media_url, media_product_type, owner, permalink, shortcode, thumbnail_url, timestamp, username, children, comments. For nested fields use syntax like 'children{media_url,media_type}'. Common field sets: 'id,caption,media_type,media_url,permalink,timestamp' for basic info; 'id,caption,comments_count,like_count' for engagement metrics. UNSUPPORTED FIELDS (will cause errors): tagged_users, user_tags, location, filter_name, latitude, longitude. To get media where a user is tagged, use INSTAGRAM_GET_IG_USER_TAGS instead. IMPORTANT: If you receive a MediaBuilder error, the ID is an unpublished container - use INSTAGRAM_GET_POST_STATUS instead. |
| `ig_media_id` | string | Yes | The unique identifier of the Instagram media object to retrieve. Must be a published media ID (photo, video, story, reel, or carousel). For unpublished container IDs, use INSTAGRAM_GET_POST_STATUS instead. |
| `graph_api_version` | string | No | Instagram Graph API version to use |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get IG Media Children

**Slug:** `INSTAGRAM_GET_IG_MEDIA_CHILDREN`

Tool to get media objects (images/videos) that are children of an Instagram carousel/album post. Use when you need to retrieve individual media items from a carousel album post. Note: Carousel children media do not support insights queries - for analytics, query metrics at the parent carousel level.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fields` | string | No | Comma-separated list of fields to return for each child media item. Available fields: id, caption, media_type, media_url, username, timestamp, permalink, thumbnail_url, ig_id, owner, shortcode, is_comment_enabled, comments_count, like_count |
| `ig_media_id` | string | Yes | The ID of a CAROUSEL_ALBUM media post (not a user ID). This must be a media ID from a carousel/album post, typically obtained by calling 'Get IG User Media' action first and filtering for media_type='CAROUSEL_ALBUM'. Media IDs are numeric strings (17 digits) that identify specific Instagram posts, distinct from user/account IDs. |
| `graph_api_version` | string | No | Instagram Graph API version to use |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get IG Media Comments

**Slug:** `INSTAGRAM_GET_IG_MEDIA_COMMENTS`

Tool to retrieve comments on an Instagram media object. Use when you need to fetch comments from a specific Instagram post, photo, video, or carousel. Supports cursor-based pagination for navigating through large comment lists.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Cursor for forward pagination. Use the cursor value from previous response's paging.cursors.after field |
| `limit` | integer | No | Number of comments to return per page (typically 50-100) |
| `before` | string | No | Cursor for backward pagination. Use the cursor value from previous response's paging.cursors.before field |
| `fields` | string | No | Comma-separated list of fields to retrieve for each comment. Available fields: id, text, username, timestamp, like_count, replies, from, hidden, media, parent_id, user |
| `ig_media_id` | string | Yes | The ID of the Instagram media object (post/photo/video/album) to retrieve comments from. Must be a Media ID, not a User ID. Media IDs can be obtained from endpoints like GET /ig-user-id/media. Media IDs typically look like '17858625294504375'. |
| `graph_api_version` | string | No | Instagram Graph API version to use |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get IG Media Insights

**Slug:** `INSTAGRAM_GET_IG_MEDIA_INSIGHTS`

Tool to get insights and metrics for Instagram media objects (photos, videos, reels, carousel albums). Use when you need to retrieve performance data such as views, reach, likes, comments, saves, and shares for specific media. Note: Insights data is only available for media published within the last 2 years, and the account must have at least 1,000 followers.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `metric` | array | Yes | List of metrics to retrieve. Must be provided as an array of strings, e.g., ['reach', 'saved', 'likes']. COMMONLY SUPPORTED METRICS: views, reach, saved, likes, comments, shares, total_interactions. REELS-SPECIFIC METRICS: ig_reels_video_view_total_time, ig_reels_avg_watch_time, reels_skip_rate, facebook_views, crossposted_views. STORIES-SPECIFIC METRICS: replies, navigation, follows, profile_visits. DEPRECATED METRICS (will be filtered out): 'impressions', 'plays', 'video_views', 'clips_replays_count', 'ig_reels_aggregated_all_plays_count' (use 'views' instead); 'taps_forward', 'taps_back', 'exits' (Story navigation metrics deprecated in API v18+, use 'navigation' instead). INVALID METRIC NAMES (will be rejected): 'clicks', 'engagement' are NOT valid metric names. |
| `period` | string | No | The time period for metric aggregation. For media insights, 'lifetime' is the default and typically the only available option. Note: You can only request metrics for one period type per request. |
| `ig_media_id` | string | Yes | The ID of the Instagram media object (photo, video, reel, carousel album) for which to retrieve insights |
| `graph_api_version` | string | No | Instagram Graph API version to use |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get IG User Content Publishing Limit

**Slug:** `INSTAGRAM_GET_IG_USER_CONTENT_PUBLISHING_LIMIT`

Get an Instagram Business Account's current content publishing usage. Use this to monitor quota usage and avoid hitting rate limits when publishing content via the API. IMPORTANT: This endpoint requires an IG User ID (Instagram Business Account ID), NOT an IGSID (Instagram Scoped ID). IGSID is only used for messaging-related endpoints. Content publishing endpoints require a proper IG User ID.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fields` | string | No | Comma-separated list of fields to return. Available fields: quota_usage, config. Defaults to 'quota_usage,config'. |
| `ig_user_id` | string | No | Instagram Business Account ID (IG User ID). Must be a valid IG User ID, NOT an IGSID/scoped ID (used for messaging). Defaults to 'me' for current user. To get your IG User ID, use GET /{facebook-page-id}?fields=instagram_business_account. |
| `graph_api_version` | string | No | Facebook Graph API version to use |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get IG User Live Media

**Slug:** `INSTAGRAM_GET_IG_USER_LIVE_MEDIA`

Get live media objects during an active Instagram broadcast. Returns the live video media ID and metadata when a live broadcast is in progress on an Instagram Business or Creator account. Use this to monitor active live streams and access real-time engagement data.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fields` | string | No | Comma-separated list of fields to return for the live media object. Available fields: id, media_type, media_url, timestamp, permalink. Defaults to all available fields. |
| `ig_user_id` | string | No | Instagram Business or Creator Account ID (optional, defaults to 'me' for current user). Must be an account with an active live broadcast. |
| `graph_api_version` | string | No | Facebook Graph API version to use |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get IG User Media

**Slug:** `INSTAGRAM_GET_IG_USER_MEDIA`

Get Instagram user's media collection (posts, photos, videos, reels, carousels). Use when you need to retrieve all media published by an Instagram Business or Creator account with support for pagination and time-based filtering.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Cursor for forward pagination - retrieve media after this cursor |
| `limit` | integer | No | Number of media items to return per page (default: 25, max: 100) |
| `since` | integer | No | Unix timestamp - filter results to media created after this time. If both 'since' and 'until' are provided, 'since' must be less than 'until'. |
| `until` | integer | No | Unix timestamp - filter results to media created before this time. If both 'since' and 'until' are provided, 'since' must be less than 'until'. |
| `before` | string | No | Cursor for backward pagination - retrieve media before this cursor |
| `fields` | string | No | Comma-separated list of fields to return. Available fields: id, caption, media_type, media_url, permalink, thumbnail_url, timestamp, username, comments_count, like_count, ig_id, is_comment_enabled, owner, shortcode, media_product_type, video_title, children{media_url,media_type,thumbnail_url} |
| `ig_user_id` | string | Yes | Instagram Business or Creator Account ID. Use 'me' for the authenticated user, or provide the numeric ID obtained from the Instagram Graph API (typically 17 digits, e.g., '17841405793187218'). If you provide a Facebook Page ID, it will be automatically converted to the Instagram Business Account ID. |
| `graph_api_version` | string | No | Instagram Graph API version to use (e.g., 'v21.0') |
| `auto_resolve_fb_page_id` | boolean | No | If true and the provided ig_user_id fails, automatically attempt to resolve it as a Facebook Page ID by retrieving the instagram_business_account field. Set to false to disable this behavior. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get IG User Stories

**Slug:** `INSTAGRAM_GET_IG_USER_STORIES`

Get active story media objects for an Instagram Business or Creator account. Stories are retrieved via the /stories endpoint. Returns stories that are currently active within the 24-hour window. Use this to retrieve story content, metadata, and engagement metrics for monitoring or analytics purposes.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Cursor for pagination to get the next page of results. Use the 'after' cursor from the previous response's paging object. |
| `limit` | integer | No | Number of stories to return per page for pagination. If not specified, returns all active stories. |
| `before` | string | No | Cursor for pagination to get the previous page of results. Use the 'before' cursor from the previous response's paging object. |
| `fields` | string | No | Comma-separated list of fields to return for each story. Available fields: id, caption, comments_count, ig_id, is_comment_enabled, like_count, media_type, media_url, owner, permalink, shortcode, thumbnail_url, timestamp, username. If not specified, defaults to id, media_type, media_url, permalink, and timestamp. |
| `ig_user_id` | string | No | Instagram Business or Creator Account ID (optional, defaults to 'me' for current user). Must be an account with active stories within the 24-hour window. |
| `graph_api_version` | string | No | Facebook Graph API version to use |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get IG User Tags

**Slug:** `INSTAGRAM_GET_IG_USER_TAGS`

Get Instagram media where the user has been tagged by other users. Use when you need to retrieve all media in which an Instagram Business or Creator account has been tagged, including tags in captions, comments, or on the media itself.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Cursor for forward pagination - retrieve media after this cursor |
| `limit` | integer | No | Number of tagged media items to return per page (default: 25, max: 100) |
| `before` | string | No | Cursor for backward pagination - retrieve media before this cursor |
| `fields` | string | No | Comma-separated list of fields to return. Available fields: id, caption, comments_count, ig_id, is_comment_enabled, like_count, media_product_type, media_type, media_url, owner, permalink, shortcode, thumbnail_url, timestamp, username, video_title. If not specified, defaults to commonly used fields. |
| `ig_user_id` | string | Yes | Instagram Business or Creator Account ID. Use 'me' for the authenticated user's account. |
| `graph_api_version` | string | No | Instagram Graph API version (e.g., 'v21.0'). If not specified, uses v21.0 as default. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Post Comments

**Slug:** `INSTAGRAM_GET_POST_COMMENTS`

Get comments on an Instagram post.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Cursor for pagination - get comments after this cursor |
| `limit` | integer | No | Number of comments to return (max 100) |
| `ig_post_id` | string | Yes | Instagram Post ID |
| `graph_api_version` | string | No | |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Post Insights

**Slug:** `INSTAGRAM_GET_POST_INSIGHTS`

Get Instagram post insights/analytics (impressions, reach, engagement, etc.).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `metric` | array | No | Metrics to retrieve for the media. If not provided and metric_preset is not set, uses auto_safe preset. Allowed metrics vary by media_product_type: IMAGE/CAROUSEL: reach, likes, comments, saves, shares. VIDEO: reach, plays, likes, comments, saves, shares. REELS: reach, likes, comments, saves, shares, total_interactions, ig_reels_video_view_total_time, ig_reels_avg_watch_time, clips_replays_count, ig_reels_aggregated_all_plays_count, views, reels_skip_rate. Note: 'plays' may not work consistently for all reel types - use 'views' instead (plays is being deprecated in API v22). Stories: reach, replies, taps_forward, taps_back, exits. Note: 'engagement' and 'impressions' are NOT valid standalone metrics - use individual metrics like likes, comments, saves, shares instead. If a metric is unsupported for the post type, API returns 400 error. |
| `ig_post_id` | string | Yes | Instagram Post ID |
| `metric_preset` | string ("auto_safe" | "image_basic" | "video_basic" | "reel_basic" | "carousel_basic") | No | Predefined metric sets for different media types to avoid API errors. |
| `graph_api_version` | string | No | |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Post Status

**Slug:** `INSTAGRAM_GET_POST_STATUS`

Check the processing status of a draft post container.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `creation_id` | string | Yes | The media container ID returned from INSTAGRAM_CREATE_MEDIA_CONTAINER action. This is a numeric string (e.g., '17843131380645284') that uniquely identifies the media container. Use this ID to check the container's publishing status before calling the publish endpoint. |
| `graph_api_version` | string | No | |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get User Info

**Slug:** `INSTAGRAM_GET_USER_INFO`

Get Instagram user info including profile details and statistics.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ig_user_id` | string | No | Instagram Business Account ID. Use "me" for the current authenticated user. If not provided, defaults to "me". |
| `graph_api_version` | string | No | |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get User Insights

**Slug:** `INSTAGRAM_GET_USER_INSIGHTS`

Get Instagram account-level insights and analytics (profile views, reach, follower count, etc.). metric_type (time_series or total_value): When set to total_value, the API returns a total_value object instead of values. breakdown: Only applicable when metric_type=total_value and only for supported metrics. timeframe: Required for demographics-related metrics and overrides since/until for those metrics.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `since` | integer | No | Start of time range (inclusive) as a Unix timestamp (seconds). Also accepts date strings (YYYY-MM-DD or ISO 8601 format) which will be converted to timestamps. |
| `until` | integer | No | End of time range (inclusive) as a Unix timestamp (seconds). Also accepts date strings (YYYY-MM-DD or ISO 8601 format) which will be converted to timestamps. |
| `metric` | array | No | Metrics to retrieve for the user account. Accepts a list of metric names or a comma-separated string. Core metrics: reach, follower_count, online_followers. Engagement metrics: accounts_engaged, total_interactions, likes, comments, shares, saves, replies. Activity metrics: follows_and_unfollows, profile_links_taps, views. Demographics metrics (require timeframe parameter): engaged_audience_demographics, reached_audience_demographics, follower_demographics. Threads metrics: threads_likes, threads_replies, reposts, quotes, threads_followers, etc. If multiple metrics are provided, all must support the same period. DEPRECATED (January 2025, Graph API v21+): impressions, email_contacts, phone_call_clicks, text_message_clicks, get_directions_clicks, profile_views, and website_clicks are no longer supported. |
| `period` | string ("day" | "week" | "days_28" | "lifetime") | No | Valid period values for Instagram user insights aggregation. Available periods: - day: Daily aggregation - week: Weekly aggregation - days_28: 28-day aggregation - lifetime: Lifetime aggregation (for audience-related metrics) |
| `breakdown` | string | No | Breakdown to use when metric_type=total_value. Allowed values: contact_button_type, follow_type, media_product_type. |
| `timeframe` | string ("this_month" | "this_week") | No | Valid timeframe values for demographics-related Instagram user insights. Required for engaged_audience_demographics and reached_audience_demographics metrics. Overrides since/until parameters when specified. Note: As of 2025, Instagram deprecated the following timeframe values for demographics metrics: last_14_days, last_30_days, last_90_days, and prev_month. Only this_week and this_month are currently supported by the Instagram Graph API. The follower_demographics metric uses period=lifetime and does not support the timeframe parameter. |
| `ig_user_id` | string | No | Instagram Business Account ID - must be a numeric ID (e.g., '17841400008460056'). Content API IDs with 'ca_' prefix are not supported. Optional, defaults to current user. |
| `metric_type` | string | No | Aggregation type for results. Allowed values: time_series, total_value. |
| `graph_api_version` | string | No | |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get User Media

**Slug:** `INSTAGRAM_GET_USER_MEDIA`

Get Instagram user's media (posts, photos, videos).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Cursor for pagination - get media after this cursor |
| `limit` | integer | No | Number of media items to return (max 100) |
| `ig_user_id` | string | No | Numeric Instagram Business Account ID (NOT username). Must be a numeric ID like '17841405793187218'. Omit or leave empty to get the current authenticated user's media. To find an account's numeric ID, use the INSTAGRAM_GET_USER_INFO action. |
| `graph_api_version` | string | No | |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List All Conversations

**Slug:** `INSTAGRAM_LIST_ALL_CONVERSATIONS`

List all Instagram DM conversations for the authenticated user.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Cursor for pagination |
| `limit` | integer | No | |
| `ig_user_id` | string | No | Instagram Business Account ID (optional for /me/conversations) |
| `graph_api_version` | string | No | |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List All Messages

**Slug:** `INSTAGRAM_LIST_ALL_MESSAGES`

List all messages from a specific Instagram DM conversation.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | string | No | Cursor for pagination |
| `limit` | integer | No | |
| `conversation_id` | string | Yes | Unique identifier for the Instagram conversation. Obtain this by calling the INSTAGRAM_LIST_ALL_CONVERSATIONS action, which returns conversation IDs in the format 'aWdfZAG06...' (base64-encoded string). |
| `graph_api_version` | string | No | |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Mark Seen

**Slug:** `INSTAGRAM_MARK_SEEN`

Mark Instagram DM messages as read/seen for a specific user. This action sends a 'mark_seen' sender action to indicate that messages from the specified recipient have been read. This is similar to the Facebook Messenger sender_action feature. IMPORTANT LIMITATIONS: - The sender_action API feature may have limited support on Instagram - The recipient must have an active 24-hour messaging window open - Requires instagram_manage_messages permission - Only works with Instagram Business or Creator accounts If this action fails with a 500 error, it may indicate that the sender_action feature is not supported for your Instagram account or the specific recipient.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ig_user_id` | string | No | Instagram Business Account ID. Optional - when not provided, the /me/messages endpoint is used instead of /{ig_user_id}/messages. |
| `recipient_id` | string | Yes | Instagram-Scoped User ID (IGSID) of the recipient. This is a numeric string obtained from conversation participants (e.g., '17841479358498320'). The recipient must have an existing conversation with your Instagram Business/Creator account. |
| `graph_api_version` | string | No | Instagram Graph API version to use (e.g., 'v21.0'). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Post IG Comment Replies

**Slug:** `INSTAGRAM_POST_IG_COMMENT_REPLIES`

Tool to create a reply to an Instagram comment. Use when you need to reply to a specific comment on an Instagram post owned by a Business or Creator account. The reply must be 300 characters or less, contain at most 4 hashtags and 1 URL, and cannot consist entirely of capital letters.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | Yes | The text content of the reply to be posted. Maximum length: 300 characters. Maximum 4 hashtags allowed. Maximum 1 URL allowed. Cannot consist entirely of capital letters. |
| `ig_comment_id` | string | Yes | The unique identifier of the Instagram comment to which you want to reply. This is the ID of the parent comment that will receive the reply. |
| `graph_api_version` | string | No | Instagram Graph API version to use. Defaults to v21.0. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Post IG Media Comments

**Slug:** `INSTAGRAM_POST_IG_MEDIA_COMMENTS`

Tool to create a comment on an Instagram media object. Use when you need to post a comment on a specific Instagram post, photo, video, or carousel. The comment must be 300 characters or less, contain at most 4 hashtags and 1 URL, and cannot consist entirely of capital letters.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | Yes | The text content of the comment to be posted on the media object. Maximum length: 300 characters. Maximum 4 hashtags allowed. Maximum 1 URL allowed. Cannot consist entirely of capital letters. |
| `ig_media_id` | string | Yes | The unique identifier of the Instagram media object where the comment will be posted. This is the ID of the Instagram post, photo, video, or carousel. |
| `graph_api_version` | string | No | Instagram Graph API version to use. Defaults to v21.0. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Post IG User Media

**Slug:** `INSTAGRAM_POST_IG_USER_MEDIA`

Tool to create a media container for Instagram posts. Use this to create a container for images, videos, Reels, or carousels. This is the first step in Instagram's two-step publishing process - after creating the container, use the media_publish endpoint to publish it.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `caption` | string | No | Caption text for the post. Use HTML URL encoding for hashtags (# becomes %23). |
| `children` | array | No | For carousel posts - array of container IDs (2-10 items) from previously created media containers. |
| `cover_url` | string | No | For Reels - MUST be a valid HTTP/HTTPS URL pointing to a custom cover image. Must start with 'http://' or 'https://'. IMPORTANT: URLs with query parameters (like signed URLs) are NOT supported by Instagram. Use direct, publicly accessible URLs without query strings. If both cover_url and thumb_offset provided, cover_url takes precedence. |
| `image_url` | string | No | MUST be a valid HTTP/HTTPS URL pointing to a publicly accessible JPEG image file. Must start with 'http://' or 'https://' (e.g., 'https://example.com/image.jpg'). IMPORTANT: URLs with query parameters (like AWS S3 signed URLs with authentication tokens) are NOT supported by Instagram and will be rejected. Use direct, publicly accessible URLs without query strings. DO NOT pass image descriptions or text - only actual URLs are accepted. One of image_url, video_url, or children must be provided. |
| `user_tags` | array | No | Array of user tag objects for tagging public Instagram accounts. For images: x and y coordinates (0.0-1.0, from top-left) are REQUIRED. For Reels: only username is allowed; x/y coordinates CANNOT be used. |
| `video_url` | string | No | MUST be a valid HTTP/HTTPS URL pointing to a publicly accessible video or Reel MP4 file. Must start with 'http://' or 'https://' (e.g., 'https://example.com/video.mp4'). IMPORTANT: URLs with query parameters (like AWS S3 signed URLs with authentication tokens) are NOT supported by Instagram and will be rejected. Use direct, publicly accessible URLs without query strings. DO NOT pass video descriptions or text - only actual URLs are accepted. One of image_url, video_url, or children must be provided. When using video_url alone, media_type will be automatically set to 'REELS' if not specified. |
| `audio_name` | string | No | For Reels - custom name for the audio track (default: 'Original Audio'). |
| `ig_user_id` | string | Yes | The unique identifier of the Instagram Business account (IG User ID) to create media for. This must be an Instagram Business account. |
| `media_type` | string ("REELS" | "CAROUSEL" | "STORIES") | No | Media type for the container. Valid values: 'REELS' (for video content), 'CAROUSEL' (for carousel posts with children), 'STORIES' (for story posts). When posting video content with video_url alone (no image_url), this will automatically default to 'REELS' if not specified. Note: 'VIDEO' is deprecated and no longer supported - use 'REELS' for all video content. |
| `location_id` | string | No | Facebook Page ID of a location to tag. The Page must have latitude/longitude data. |
| `thumb_offset` | integer | No | For videos/Reels - millisecond offset for thumbnail frame (default: 0). |
| `collaborators` | array | No | Array of up to 3 public Instagram usernames to tag as collaborators. Supported for images, videos, carousels (not Stories). |
| `share_to_feed` | boolean | No | For Reels - whether to share to both Feed and Reels tabs. Only applicable when media_type is REELS. |
| `is_carousel_item` | boolean | No | Indicates this container is part of a carousel. For carousels: create 2-10 individual containers, then create a parent carousel container with their IDs. |
| `graph_api_version` | string | No | Instagram Graph API version to use. Defaults to v21.0. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Publish IG User Media

**Slug:** `INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH`

Tool to publish a media container to an Instagram Business account. This action automatically waits for the container to finish processing before publishing. Rate limited to 25 API-published posts per 24-hour moving window. The publishing process: 1. First, create a media container using INSTAGRAM_CREATE_MEDIA_CONTAINER 2. Call this action with the creation_id - it will automatically poll for FINISHED status 3. Once ready, the media is published and the published media ID is returned For videos/reels, processing may take 30-120 seconds. Images are typically instant.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ig_user_id` | string | Yes | Instagram Business Account ID (numeric string) or 'me' for the authenticated user. This ID is returned by INSTAGRAM_GET_USER_INFO or similar actions. Do NOT pass bank account numbers, connection IDs, or other non-Instagram identifiers. |
| `creation_id` | string | Yes | Container ID returned by INSTAGRAM_CREATE_MEDIA_CONTAINER (numeric string). This is NOT the same as ig_user_id. Do NOT pass bank account numbers or other non-Instagram identifiers. |
| `max_wait_seconds` | integer | No | Maximum time in seconds to wait for the container to reach FINISHED status. For images this is typically instant, but videos/reels may take 30-120 seconds to process. Set to 0 to skip status checking and attempt immediate publish. Default is 60 seconds. |
| `graph_api_version` | string | No | Instagram Graph API version to use. Defaults to v21.0. |
| `poll_interval_seconds` | number | No | Interval in seconds between status checks while waiting for the container to be ready. Default is 3 seconds. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Reply to IG User Mentions

**Slug:** `INSTAGRAM_POST_IG_USER_MENTIONS`

Tool to reply to a mention of your Instagram Business or Creator account. Use when you need to respond to comments or media captions where your account has been @mentioned by another Instagram user. This creates a comment on the media or comment containing the mention.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | Yes | The text content of your reply to the mention. This creates a comment on the media or comment where you were mentioned. |
| `media_id` | string | Yes | The ID of the Instagram media object (post, photo, video, or carousel) where your account was mentioned. This is the media containing the original mention. |
| `comment_id` | string | No | Optional ID of a specific comment where you were mentioned. If provided, your reply will be directed to that comment. If not provided, the reply will be posted on the media itself. |
| `ig_user_id` | string | Yes | The unique identifier of the Instagram Business or Creator account that was mentioned. This is the ID of your Instagram account that received the mention. |
| `graph_api_version` | string | No | Instagram Graph API version to use. Defaults to v21.0. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Reply To Comment

**Slug:** `INSTAGRAM_REPLY_TO_COMMENT`

Reply to a comment on Instagram media.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | Yes | Reply message text |
| `ig_comment_id` | string | Yes | Instagram Comment ID to reply to |
| `graph_api_version` | string | No | |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Send Image

**Slug:** `INSTAGRAM_SEND_IMAGE`

Send an image via Instagram DM to a specific user.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image_url` | string | Yes | Publicly accessible URL of the image to send. Must be a direct link to an image file (JPEG, PNG, or GIF) that is reachable over HTTPS. The URL must not require authentication to access. |
| `ig_user_id` | string | No | Instagram Business Account ID. Must be a numeric ID string (e.g., '17841400123456789'), not a username. Optional when using /me/messages endpoint. |
| `recipient_id` | string | Yes | Recipient's IGSID (Instagram Scoped User ID). Must be a numeric ID string (e.g., '17841479358498320'), NOT a username. IGSIDs are obtained from conversations or webhook events when users message your business first. You can only send messages to users who have initiated a conversation with your business within the past 24 hours (or 7 days with HUMAN_AGENT tag). |
| `graph_api_version` | string | No | Instagram Graph API version to use (e.g., 'v21.0'). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Send Text Message

**Slug:** `INSTAGRAM_SEND_TEXT_MESSAGE`

Send a text message to an Instagram user via DM.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Message text to send |
| `ig_user_id` | string | No | Instagram Business Account ID (optional when using /me/messages) |
| `recipient_id` | string | Yes | Recipient PSID (Instagram-scoped ID) |
| `graph_api_version` | string | No | Instagram Graph API version |
| `reply_to_message_id` | string | No | Message ID (mid) to reply to. This creates a visual reply link to the original message in the conversation. The mid can be obtained from webhook events or previous API responses. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

# Google Calendar

Google Calendar is a time management tool providing scheduling features, event reminders, and integration with email and other apps for streamlined organization

- **Category:** scheduling & booking
- **Auth:** OAUTH2
- **Tools:** 46
- **Triggers:** 7
- **Slug:** `GOOGLECALENDAR`
- **Version:** 20260212_00

## Frequently Asked Questions

### How do I set up custom Google OAuth credentials for Google Calendar?

For a step-by-step guide on creating and configuring your own Google OAuth credentials with Composio, see [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

## Tools

### Delete ACL Rule

**Slug:** `GOOGLECALENDAR_ACL_DELETE`

Deletes an access control rule from a Google Calendar. Use when you need to remove sharing permissions for a user, group, or domain.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `rule_id` | string | Yes | ACL rule identifier. |
| `calendar_id` | string | Yes | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get ACL Rule

**Slug:** `GOOGLECALENDAR_ACL_GET`

Retrieves a specific access control rule for a calendar. Use when you need to check permissions for a specific user, group, or domain.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `rule_id` | string | Yes | ACL rule identifier. Format: 'scope_type:scope_value' or 'default'. Valid scope types: 'user' (email), 'group' (group email), 'domain' (domain name), 'default' (public access). Examples: 'user:john@example.com', 'group:team@example.com', 'domain:example.com', 'default'. Note: 'me' is NOT valid; use actual email/domain. The rule must exist - use GOOGLECALENDAR_LIST_ACL_RULES to find valid IDs. |
| `calendar_id` | string | Yes | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create ACL Rule

**Slug:** `GOOGLECALENDAR_ACL_INSERT`

Creates an access control rule for a calendar. Use when you need to grant sharing permissions to a user, group, or domain.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `role` | string ("none" | "freeBusyReader" | "reader" | "writer" | "owner") | Yes | The role assigned to the scope. Possible values: "none" - Provides no access; "freeBusyReader" - Provides read access to free/busy information; "reader" - Provides read access to the calendar; "writer" - Provides read and write access to the calendar; "owner" - Provides ownership of the calendar. |
| `scope` | object | Yes | The extent to which calendar access is granted by this ACL rule. Specifies who gets the access (user, group, domain, or default). |
| `calendar_id` | string | Yes | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `send_notifications` | boolean | No | Whether to send notifications about the calendar sharing change. Optional. The default is true. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Patch ACL Rule

**Slug:** `GOOGLECALENDAR_ACL_PATCH`

Updates an existing access control rule for a calendar using patch semantics (partial update). This allows modifying specific fields without affecting other properties. IMPORTANT: The ACL rule must already exist on the calendar. This action cannot create new rules. If you receive a 404 Not Found error, the rule does not exist - use ACL insert to create it first, or use ACL list to verify available rules. Each patch request consumes three quota units. For domain-type ACL rules, if PATCH fails with 500 error, this action will automatically fallback to UPDATE method.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `role` | string | No | The role assigned to the scope. Possible values are: "none" - Provides no access; "freeBusyReader" - Provides read access to free/busy information; "reader" - Provides read access to the calendar (private events appear but details are hidden); "writer" - Provides read and write access to the calendar (private events and details are visible); "owner" - Provides ownership of the calendar (all permissions of writer plus ability to see and manipulate ACLs). |
| `scope` | object | No | The extent to which calendar access is granted by this ACL rule. Optional for patch operations. |
| `rule_id` | string | Yes | ACL rule identifier of an existing rule. IMPORTANT: The rule must already exist on the calendar - this action cannot create new rules, only modify existing ones. Use the ACL list action to find existing rule IDs, or use the ACL insert action to create a new rule first. Format: 'type:value', such as 'user:email@example.com' or 'group:group@example.com'. |
| `calendar_id` | string | Yes | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `send_notifications` | boolean | No | Whether to send notifications about the calendar sharing change. Note that there are no notifications on access removal. Optional. The default is True. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Watch ACL Changes

**Slug:** `GOOGLECALENDAR_ACL_WATCH`

Tool to watch for changes to ACL resources. Use when you need to set up real-time notifications for access control list modifications on a calendar.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | A UUID or similar unique string that identifies this channel. |
| `type` | string | No | The type of delivery mechanism used for this channel. Valid values are "web_hook" or "webhook". |
| `token` | string | No | An arbitrary string delivered to the target address with each notification delivered over this channel. Optional. |
| `params` | object | No | Additional parameters controlling delivery channel behavior. Optional. |
| `address` | string | Yes | The address where notifications are delivered for this channel. |
| `pageToken` | string | No | Token specifying which result page to return. Optional. |
| `syncToken` | string | No | Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. All entries deleted since the previous list request will always be in the result set and it is not allowed to set showDeleted to False. Optional. |
| `calendarId` | string | Yes | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `maxResults` | integer | No | Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries. Optional. |
| `showDeleted` | boolean | No | Whether to include deleted ACLs in the result. Deleted ACLs are represented by role equal to 'none'. Deleted ACLs will always be included if syncToken is provided. Optional. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Batch Events

**Slug:** `GOOGLECALENDAR_BATCH_EVENTS`

Execute up to 1000 event mutations (create/patch/delete) in one Google Calendar HTTP batch request with per-item status/results. Use this to materially reduce round-trips for bulk operations like migrations, cleanup, or large-scale updates.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fail_fast` | boolean | No | If true, stop processing after the first batch containing any 4xx error (except 404 on DELETE). Default is false. |
| `operations` | array | Yes | List of batch operations to execute. Maximum 1000 operations per request. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Remove Calendar from List

**Slug:** `GOOGLECALENDAR_CALENDAR_LIST_DELETE`

Tool to remove a calendar from the user's calendar list. Use when you need to unsubscribe from or hide a calendar from the user's list.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendar_id` | string | Yes | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the 'primary' keyword. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Single Calendar by ID

**Slug:** `GOOGLECALENDAR_CALENDAR_LIST_GET`

Retrieves metadata for a SINGLE specific calendar from the user's calendar list by its calendar ID. This action requires a calendarId parameter and returns details about that one calendar only. NOTE: This does NOT list all calendars. To list all calendars in the user's calendar list, use GOOGLECALENDAR_CALENDAR_LIST_LIST instead.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendarId` | string | Yes | Required. The calendar identifier for the single calendar to retrieve. Use 'primary' for the primary calendar of the authenticated user, or provide a specific calendar ID (e.g., an email address or group calendar ID). To find calendar IDs, first use GOOGLECALENDAR_CALENDAR_LIST_LIST to list all calendars. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Insert Calendar into List

**Slug:** `GOOGLECALENDAR_CALENDAR_LIST_INSERT`

Inserts an existing calendar into the user's calendar list.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The identifier of the calendar to insert. Must be a valid calendar ID in email format (e.g., 'user@example.com' for a user's calendar or 'calendarid@group.calendar.google.com' for a shared calendar). Note: The 'primary' keyword is not supported for this operation - use the actual email address of the primary calendar instead. The calendar must exist and you must have appropriate access permissions. |
| `hidden` | boolean | No | Whether the calendar has been hidden from the list. Accepts only boolean values: true or false. If not specified, the API defaults to false. |
| `color_id` | string | No | The color of the calendar. This is an ID referring to an entry in the calendarCore color palette. |
| `selected` | boolean | No | Whether the calendar is selected and visible in the calendar list. Accepts only boolean values: true or false. If not specified, the API defaults to false. |
| `background_color` | string | No | The background color of the calendar in the Web UI. (Hexadecimal color code) |
| `color_rgb_format` | boolean | No | Whether to use the foregroundColor and backgroundColor fields to write the calendar colors (RGB). If this feature is used, the index-based colorId field will be set to the best matching option automatically. Optional. The default is False. |
| `foreground_color` | string | No | The foreground color of the calendar in the Web UI. (Hexadecimal color code) |
| `summary_override` | string | No | The summary that the authenticated user has set for this calendar. |
| `default_reminders` | array | No | The default reminders that the authenticated user has for this calendar. |
| `notification_settings` | object | No | The notifications that the authenticated user is receiving for this calendar. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Patch Calendar List Entry

**Slug:** `GOOGLECALENDAR_CALENDAR_LIST_PATCH`

Updates an existing calendar on the user's calendar list using patch semantics. This method allows partial updates, modifying only the specified fields.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hidden` | boolean | No | Whether calendar is hidden. |
| `colorId` | string | No | ID for calendar color from colors endpoint. |
| `selected` | boolean | No | Whether calendar content shows in UI. |
| `calendar_id` | string | Yes | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. Use "primary" keyword for the currently logged in user's primary calendar. |
| `colorRgbFormat` | boolean | No | Whether to use RGB for foreground/background colors. |
| `backgroundColor` | string | No | Hex color for calendar background. |
| `foregroundColor` | string | No | Hex color for calendar foreground. |
| `summaryOverride` | string | No | User-set summary for the calendar. |
| `defaultReminders` | array | No | List of default reminders. |
| `notificationSettings` | object | No | Notification settings for the calendar. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Calendar List Entry

**Slug:** `GOOGLECALENDAR_CALENDAR_LIST_UPDATE`

Updates an existing entry on the user\'s calendar list.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hidden` | boolean | No | Whether calendar is hidden. |
| `colorId` | string | No | ID for calendar color from colors endpoint. |
| `selected` | boolean | No | Whether calendar content shows in UI. |
| `calendar_id` | string | Yes | Calendar identifier. Must be an actual calendar ID (e.g., "examplecalendar@group.calendar.google.com" or "c_abc123...@group.calendar.google.com"). To retrieve valid calendar IDs, use the GOOGLECALENDAR_LIST_CALENDARS action first. The "primary" alias is not valid for calendarList.update. |
| `colorRgbFormat` | boolean | No | Whether to use RGB for foreground/background colors. |
| `backgroundColor` | string | No | Hex color for calendar background. |
| `foregroundColor` | string | No | Hex color for calendar foreground. |
| `summaryOverride` | string | No | User-set summary for the calendar. |
| `defaultReminders` | array | No | List of default reminders. |
| `notificationSettings` | object | No | Notification settings for the calendar. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Watch Calendar List

**Slug:** `GOOGLECALENDAR_CALENDAR_LIST_WATCH`

Watch for changes to CalendarList resources using push notifications. Use this to receive real-time updates when calendar list entries are modified.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | A UUID or similar unique string that identifies this channel. Maximum 64 characters. |
| `type` | string | Yes | The type of delivery mechanism used for this channel. Must be "web_hook" or "webhook". |
| `token` | string | No | An arbitrary string delivered to the target address with each notification. Maximum 256 characters. Used for channel verification and message routing. |
| `params` | object | No | Additional parameters controlling delivery channel behavior. |
| `address` | string | Yes | The HTTPS URL where notifications are delivered for this channel. Must have a valid SSL certificate. |
| `expiration` | integer | No | Unix timestamp in milliseconds indicating when the API should stop sending notifications. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete Calendar

**Slug:** `GOOGLECALENDAR_CALENDARS_DELETE`

Deletes a secondary calendar that you own or have delete permissions on. You cannot delete your primary calendar or calendars you only have read/write access to. Use calendarList.list to find calendars with owner accessRole. For primary calendars, use calendars.clear instead.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendar_id` | string | Yes | Calendar identifier for a secondary calendar you own or have delete permissions on. Use calendarList.list to find deletable calendar IDs (look for accessRole "owner"). Primary calendars cannot be deleted; use the Clear Calendar action instead. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Calendar

**Slug:** `GOOGLECALENDAR_CALENDARS_UPDATE`

Updates metadata for a calendar.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `summary` | string | Yes | Title of the calendar. |
| `location` | string | No | Geographic location of the calendar as free-form text. Optional. |
| `timeZone` | string | No | The time zone of the calendar. (Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich".) Optional. |
| `calendarId` | string | Yes | Calendar identifier. Use 'primary' to update the primary calendar of the currently logged in user, or provide a specific calendar ID (typically in email format like 'abc123@group.calendar.google.com'). To retrieve calendar IDs call the calendarList.list method. IMPORTANT: This is NOT the calendar's display name/title. NOTE: For better performance, prefer providing the actual calendar ID instead of 'primary', as the 'primary' alias requires an additional API call to resolve. |
| `description` | string | No | Description of the calendar. Optional. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Stop Channel

**Slug:** `GOOGLECALENDAR_CHANNELS_STOP`

Tool to stop watching resources through a notification channel. Use when you need to discontinue push notifications for a specific channel subscription.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | A UUID or similar unique string that identifies this channel. |
| `token` | string | No | An arbitrary string delivered to the target address with each notification delivered over this channel. Optional. |
| `resourceId` | string | Yes | An opaque ID that identifies the resource being watched on this channel. Stable across different API versions. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Clear Calendar

**Slug:** `GOOGLECALENDAR_CLEAR_CALENDAR`

Clears a primary calendar. This operation deletes all events associated with the primary calendar of an account.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendar_id` | string | Yes | Calendar identifier. To retrieve calendar IDs call the `calendarList.list` method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Color Definitions

**Slug:** `GOOGLECALENDAR_COLORS_GET`

Returns the color definitions for calendars and events. Use when you need to retrieve the available color palette for styling calendars or events.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create Event

**Slug:** `GOOGLECALENDAR_CREATE_EVENT`

Create a Google Calendar event using `start_datetime` plus `event_duration_hour` and `event_duration_minutes` fields to derive the end time. Requires calendar write access. The organizer is added as an attendee unless `exclude_organizer` is True. By default, attempts to create a Google Meet link for the event (create_meeting_room defaults to True). Workspace accounts will receive a Meet link, while personal Gmail accounts will gracefully fallback to creating an event without a Meet link when conference creation fails. Set create_meeting_room to False to explicitly skip Meet link creation. Example request to create event for 1 hour 30 minutes: { "calendar_id": "primary", "start_datetime": "2025-01-16T13:00:00", "timezone": "America/New_York", "event_duration_hour": 1, "event_duration_minutes": 30, "summary": "Client sync", "attendees": ["guest@example.com", "test@example.com"] }

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `summary` | string | No | Summary (title) of the event. |
| `location` | string | No | Geographic location of the event as free-form text. |
| `timezone` | string | No | IANA timezone name from the timezone database (e.g., 'America/New_York', 'Europe/London', 'Asia/Jerusalem', 'UTC'). Required if datetime is naive. For recurring events, start and end must include a timeZone. If not provided, UTC is used. If datetime includes timezone info (Z or offset), this field is optional and defaults to UTC. IMPORTANT: Must be a valid IANA timezone identifier. Values like 'EST', 'PST', 'ISRAEL TIME', or other abbreviations are NOT valid IANA timezone names. |
| `attendees` | array | No | List of attendee email addresses. IMPORTANT: Only email addresses are accepted (e.g., 'user@example.com'). Plain names like 'John' or 'Andrew' cannot be used - you must provide the full email address. This tool does not resolve names to email addresses. |
| `eventType` | string ("birthday" | "default" | "focusTime" | "outOfOffice" | "workingLocation") | No | Type of the event, immutable post-creation. 'workingLocation' (REQUIRES Google Workspace Enterprise). Note: 'fromGmail' events cannot be created via API. |
| `recurrence` | array | No | List of RRULE, EXRULE, RDATE, EXDATE lines for recurring events. Supported frequencies: DAILY, WEEKLY, MONTHLY, YEARLY. For recurring events, start.timeZone and end.timeZone must be present. UNTIL values follow RFC 5545: date-only (YYYYMMDD) for all-day events, or UTC datetime with Z suffix (YYYYMMDDTHHMMSSZ) for timed events. UNTIL values with time but missing Z suffix are auto-corrected. Provide an empty list to remove recurrence so the event becomes non-recurring. |
| `visibility` | string ("default" | "public" | "private" | "confidential") | No | Event visibility: 'default', 'public', 'private', or 'confidential'. |
| `calendar_id` | string | No | Calendar identifier. Use 'primary' (recommended) for the user's main calendar. Alternatively, use a calendar ID from the user's accessible calendar list. Calendar IDs look like email addresses (e.g., 'xyz@group.calendar.google.com' for shared calendars). Important: Arbitrary email addresses will NOT work - the calendar must exist in the user's calendar list with appropriate access permissions. Use GOOGLECALENDAR_LIST_CALENDARS to retrieve valid calendar IDs. |
| `description` | string | No | Description of the event. Can contain HTML. Optional. Must be omitted for 'birthday' event type. |
| `send_updates` | boolean | No | Defaults to True. Whether to send updates to the attendees. |
| `transparency` | string ("opaque" | "transparent") | No | 'opaque' (busy) or 'transparent' (available). |
| `start_datetime` | string | Yes | REQUIRED. Event start time in ISO 8601 format: YYYY-MM-DDTHH:MM:SS. IMPORTANT: Natural language expressions like 'tomorrow', 'next Monday', '2pm tomorrow' are NOT supported and will be rejected. You must provide the exact date and time in ISO format. Fractional seconds (e.g., .000) and timezone info (Z, +, -) will be automatically stripped if provided. Examples: '2025-01-16T13:00:00', '2025-01-16T13:00'. |
| `exclude_organizer` | boolean | No | If True, the organizer will NOT be added as an attendee. Default is False (organizer is included). |
| `guests_can_modify` | boolean | No | If True, guests can modify the event. |
| `birthdayProperties` | object | No | Properties for birthday events. |
| `create_meeting_room` | boolean | No | Defaults to True. When True, for CREATE operations creates a Google Meet link; for UPDATE operations preserves existing conference data if present, or adds a new Meet link if none exists. Google Workspace accounts will successfully receive a Meet link. Personal Gmail accounts and other unsupported accounts will gracefully fallback to creating an event without a Meet link when conference creation fails. Set to False to skip Meet link operations (won't create new or modify existing conference data). The fallback ensures event creation succeeds even when conference features are unavailable due to account limitations. |
| `event_duration_hour` | integer | No | Number of hours for the event duration. Supports multi-day events (e.g., 240 hours = 10 days). For durations under 1 hour, use event_duration_minutes instead. |
| `extended_properties` | object | No | Extended properties of the event for storing custom metadata. Contains 'private' (visible only on this calendar) and/or 'shared' (visible to all attendees) dictionaries mapping string keys to string values. Example: {'private': {'key1': 'value1'}, 'shared': {'key2': 'value2'}} |
| `focusTimeProperties` | object | No | Properties for focusTime events. REQUIRES Google Workspace Enterprise account with Focus Time feature enabled. |
| `guestsCanInviteOthers` | boolean | No | Whether attendees other than the organizer can invite others to the event. |
| `outOfOfficeProperties` | object | No | Properties for outOfOffice events. |
| `event_duration_minutes` | integer | No | Duration in minutes (0-59 ONLY). NEVER use 60+ minutes - use event_duration_hour=1 instead. Maximum value is 59. Combined duration (hours + minutes) must be greater than 0. |
| `guestsCanSeeOtherGuests` | boolean | No | Whether attendees other than the organizer can see who the event's attendees are. |
| `workingLocationProperties` | object | No | Properties for workingLocation events. REQUIRES Google Workspace Enterprise. Constraints discovered from testing: - Must set transparency='transparent' and visibility='public' - Description must be omitted - Depending on 'type', include one of 'homeOffice', 'officeLocation', or 'customLocation' |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete event

**Slug:** `GOOGLECALENDAR_DELETE_EVENT`

Deletes a specified event by `event_id` from a Google Calendar (`calendar_id`); this action is idempotent and raises a 404 error if the event is not found.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event_id` | string | Yes | Unique identifier of the event to delete. For standalone events, use the base event ID (e.g., 'abc123def456'). For recurring event instances, use the instance ID format 'baseEventId_YYYYMMDDTHHMMSSZ' (e.g., 'abc123def456_20260522T093000Z') where the timestamp suffix represents the instance's original start time in UTC. Instance IDs can be obtained from the EVENTS_INSTANCES action. To delete ALL occurrences of a recurring event, use the base event ID without the timestamp suffix. |
| `calendar_id` | string | No | Identifier of the Google Calendar (e.g., email address, specific ID, or 'primary' for the authenticated user's main calendar) from which the event will be deleted. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a calendar

**Slug:** `GOOGLECALENDAR_DUPLICATE_CALENDAR`

Creates a new, empty Google Calendar with the specified title (summary).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `summary` | string | Yes | Title for the new Google Calendar to be created. Required and must be a non-empty string. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Event

**Slug:** `GOOGLECALENDAR_EVENTS_GET`

Retrieves a SINGLE event by its unique event_id (REQUIRED). This action does NOT list or search events - it fetches ONE specific event when you already know its ID. If you want to list events within a time range, search for events, or filter by criteria like time_min/time_max, use GOOGLECALENDAR_EVENTS_LIST instead.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event_id` | string | Yes | REQUIRED. The unique identifier of the specific event to retrieve. You must already know this ID (e.g., from a previous EVENTS_LIST call or event creation response). This action fetches ONE event by ID - it cannot list or search events. To find events by time range or search criteria, use GOOGLECALENDAR_EVENTS_LIST instead. |
| `time_zone` | string | No | Time zone used in the response. If not specified, the calendar's time zone is used. |
| `calendar_id` | string | No | Identifier of the Google Calendar (e.g., email address, specific ID, or 'primary' for the authenticated user's main calendar) from which to retrieve the event. |
| `max_attendees` | integer | No | Maximum number of attendees to include in the response. If there are more than the specified number, only the participant is returned. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Import Event

**Slug:** `GOOGLECALENDAR_EVENTS_IMPORT`

Tool to import an event as a private copy to a calendar. Use when you need to add an existing event to a calendar using its iCalUID. Only events with eventType='default' can be imported.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `end` | object | Yes | The (exclusive) end time of the event. For all-day events, use 'date' field; for timed events, use 'dateTime' and 'timeZone' fields. |
| `start` | object | Yes | The (inclusive) start time of the event. For all-day events, use 'date' field; for timed events, use 'dateTime' and 'timeZone' fields. |
| `source` | object | No | Source from which the event was created. |
| `status` | string | No | Status of the event. Possible values: 'confirmed', 'tentative', 'cancelled'. |
| `colorId` | string | No | The color of the event. This is an ID referring to an entry in the event colors definition. |
| `iCalUID` | string | Yes | Event unique identifier as defined in RFC5545. This is required to identify the event being imported. |
| `summary` | string | No | Title of the event. |
| `location` | string | No | Geographic location of the event as free-form text. |
| `sequence` | integer | No | Sequence number as per iCalendar. |
| `attendees` | array | No | The attendees of the event. |
| `reminders` | object | No | Information about the event's reminders for the authenticated user. |
| `recurrence` | array | No | List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as specified in RFC5545. |
| `visibility` | string | No | Visibility of the event. Possible values: 'default', 'public', 'private', 'confidential'. Default: 'default'. |
| `attachments` | array | No | File attachments for the event. |
| `calendar_id` | string | No | Calendar identifier. Use 'primary' for the logged-in user's primary calendar or the calendar's email address. |
| `description` | string | No | Description of the event. Can contain HTML. |
| `transparency` | string | No | Whether the event blocks time on the calendar. Possible values: 'opaque' (blocks time), 'transparent' (does not block time). Default: 'opaque'. |
| `guestsCanModify` | boolean | No | Whether attendees other than the organizer can modify the event. Default: False. |
| `extendedProperties` | object | No | Extended properties of the event. |
| `supportsAttachments` | boolean | No | Whether API client performing operation supports event attachments. Default: False. |
| `conferenceDataVersion` | integer | No | Version number of conference data supported by the API client. Version 0 assumes no conference data support and ignores conference data in the event's body. Version 1 enables copying of ConferenceData as well as for creating new conferences using the createRequest field of conferenceData. Default: 0. |
| `guestsCanInviteOthers` | boolean | No | Whether attendees other than the organizer can invite others to the event. Default: True. |
| `guestsCanSeeOtherGuests` | boolean | No | Whether attendees other than the organizer can see who the event's attendees are. Default: True. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Event Instances

**Slug:** `GOOGLECALENDAR_EVENTS_INSTANCES`

Returns instances of the specified recurring event.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `eventId` | string | Yes | REQUIRED. The ID of the recurring event whose instances you want to retrieve. You must first use GOOGLECALENDAR_FIND_EVENT or GOOGLECALENDAR_EVENTS_LIST to find recurring events and get their IDs. This action only works with recurring events that have a recurrence rule. |
| `timeMax` | string | No | Upper bound (exclusive) for an event's start time to filter by. Optional. The default is not to filter by start time. Must be an RFC3339 timestamp with mandatory time zone offset. |
| `timeMin` | string | No | Lower bound (inclusive) for an event's end time to filter by. Optional. The default is not to filter by end time. Must be an RFC3339 timestamp with mandatory time zone offset. |
| `timeZone` | string | No | Time zone used in the response. Optional. The default is the time zone of the calendar. |
| `pageToken` | string | No | Token specifying which result page to return. Optional. |
| `calendarId` | string | Yes | Calendar identifier. To retrieve calendar IDs call the `calendarList.list` method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `maxResults` | integer | No | Maximum number of events returned on one result page. By default the value is 250 events. The page size can never be larger than 2500 events. Optional. |
| `showDeleted` | boolean | No | Whether to include deleted events (with status equals "cancelled") in the result. Cancelled instances of recurring events will still be included if `singleEvents` is False. Optional. The default is False. |
| `maxAttendees` | integer | No | The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional. |
| `originalStart` | string | No | The original start time of the instance in the result. Optional. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Events

**Slug:** `GOOGLECALENDAR_EVENTS_LIST`

Returns events on the specified calendar. TIMEZONE WARNING: When using timeMin/timeMax with UTC timestamps (ending in 'Z'), the time window is interpreted in UTC regardless of the calendar's timezone. For example, querying '2026-01-19T00:00:00Z' to '2026-01-20T00:00:00Z' on a calendar in America/Los_Angeles (UTC-8) covers 2026-01-18 4pm to 2026-01-19 4pm local time, potentially missing events on the intended local date. To query for a specific local date, use timestamps with the appropriate timezone offset in timeMin/timeMax (e.g., '2026-01-19T00:00:00-08:00' for PST).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | No | Free text search terms to find events that match these terms in various fields. Optional. |
| `iCalUID` | string | No | Specifies an event ID in the iCalendar format to be provided in the response. Optional. Use this if you want to search for an event by its iCalendar ID. |
| `orderBy` | string | No | The order of the events returned in the result. Optional. The default is an unspecified, stable order. Acceptable values are: "startTime", "updated". When set to "startTime", singleEvents must be true. The action automatically sets singleEvents=true when orderBy='startTime'. |
| `timeMax` | string | No | Upper bound (exclusive) for an event's start time to filter by. Optional. If unset, no start-time upper bound is applied. Must be an RFC3339 timestamp with mandatory time zone offset (e.g., 2011-06-03T10:00:00-07:00 or 2011-06-03T10:00:00Z). Milliseconds may be provided but are ignored. If timeMin is set, timeMax must be greater than timeMin. TIMEZONE WARNING: If using UTC times (ending in 'Z') but the calendar is in a different timezone, the time window may not align with local calendar dates. For example, '2026-01-19T00:00:00Z' to '2026-01-20T00:00:00Z' covers 2026-01-18 4pm to 2026-01-19 4pm in America/Los_Angeles (UTC-8). To query a specific local date, use timestamps with the appropriate local timezone offset (e.g., '2026-01-19T00:00:00-08:00' for PST). NOTE: Natural language expressions like 'today', 'tomorrow', 'next week' are NOT supported. |
| `timeMin` | string | No | Lower bound (exclusive) for an event's end time to filter by. Optional. If unset, no end-time lower bound is applied. Must be an RFC3339 timestamp with mandatory time zone offset (e.g., 2011-06-03T10:00:00-07:00 or 2011-06-03T10:00:00Z). Milliseconds may be provided but are ignored. If timeMax is set, timeMin must be smaller than timeMax. TIMEZONE WARNING: If using UTC times (ending in 'Z') but the calendar is in a different timezone, the time window may not align with local calendar dates. For example, '2026-01-19T00:00:00Z' to '2026-01-20T00:00:00Z' covers 2026-01-18 4pm to 2026-01-19 4pm in America/Los_Angeles (UTC-8). To query a specific local date, use timestamps with the appropriate timezone offset (e.g., '2026-01-19T00:00:00-08:00' for PST). NOTE: Natural language expressions like 'today', 'tomorrow', 'next week' are NOT supported. |
| `timeZone` | string | No | Time zone used in the response for formatting event times. Optional. Use an IANA time zone identifier (e.g., America/Los_Angeles). Defaults to the user's primary time zone. Offsets (e.g., '-03:00', 'UTC+0') and abbreviations (e.g., 'IST', 'PST') are invalid. NOTE: This parameter only affects how event times are displayed in the response. It does NOT change how timeMin/timeMax filtering is interpreted. To query a specific local date, use timestamps with the appropriate timezone offset directly in timeMin/timeMax (e.g., '2026-01-19T00:00:00-08:00'). |
| `pageToken` | string | No | Opaque pagination token from a previous response's nextPageToken field. Must be the exact string returned by the API - do not use placeholder values like 'NEXT', 'next', '1', '2', etc. Omit this parameter entirely for the first page of results. Optional. |
| `syncToken` | string | No | Token from nextSyncToken to return only entries changed since the last list. Cannot be combined with iCalUID, orderBy, privateExtendedProperty, q, sharedExtendedProperty, timeMin, timeMax, or updatedMin. Deletions since the previous list are always included; showDeleted cannot be false in this mode. The action automatically removes conflicting parameters when syncToken is provided. |
| `calendarId` | string | No | Calendar identifier. Use "primary" for the user's main calendar, or a calendar ID from the user's accessible calendar list. Arbitrary email addresses will NOT work - the calendar must exist in the user's calendar list. Use GOOGLECALENDAR_LIST_CALENDARS to retrieve valid calendar IDs. Defaults to "primary". Empty strings will be treated as "primary". |
| `eventTypes` | string | No | Event types to return. Optional. Pass a single value only. If unset, returns all event types. Acceptable values are: "birthday", "default", "focusTime", "fromGmail", "outOfOffice", "workingLocation". |
| `maxResults` | integer | No | Maximum number of events returned on one result page. The number of events in the resulting page may be less than this value, or none at all, even if there are more events matching the query. Incomplete pages can be detected by a non-empty nextPageToken field in the response. By default the value is 250 events. The page size can never be larger than 2500 events. Optional. Must be >= 1 if provided. |
| `updatedMin` | string | No | Lower bound for an event's last modification time (RFC3339). When specified, entries deleted since this time are always included regardless of showDeleted. Optional. |
| `showDeleted` | boolean | No | Include cancelled events (status="cancelled"). Optional; default is false. This surfaces cancelled (soft-deleted) events, not items in the Trash. When syncToken or updatedMin is used, deletions since those markers are included regardless of showDeleted. Recurring interaction: if singleEvents=false and showDeleted=false, cancelled instances of a recurring series may still be included; if showDeleted=true and singleEvents=true, only single deleted instances (not parent series) are returned. |
| `maxAttendees` | integer | No | The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional. Must be >= 1 if provided. |
| `singleEvents` | boolean | No | Whether to expand recurring events into instances and only return single one-off events and instances of recurring events. Optional. The default is False. |
| `alwaysIncludeEmail` | boolean | No | Deprecated and ignored. |
| `showHiddenInvitations` | boolean | No | Whether to include hidden invitations in the result. Optional. The default is False. Hidden invitations are events where your attendee entry has responseStatus='needsAction' and attendees[].self==true. When true, such invitations are included. |
| `sharedExtendedProperty` | string | No | Extended properties constraint specified as propertyName=value. Matches only shared properties. This parameter might be repeated multiple times to return events that match all given constraints. |
| `privateExtendedProperty` | string | No | Extended properties constraint specified as propertyName=value. Matches only private properties. This parameter might be repeated multiple times to return events that match all given constraints. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Events from All Calendars

**Slug:** `GOOGLECALENDAR_EVENTS_LIST_ALL_CALENDARS`

Return a unified event list across all calendars in the user's calendar list for a given time range. Use when you need a single view of all events across multiple calendars.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | No | Free text search terms to find events that match these terms in any field, except for extended properties. Optional. |
| `time_max` | string | Yes | Upper bound (exclusive) for an event's start time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset (e.g., 2011-06-03T10:00:00-07:00 or 2011-06-03T10:00:00Z). If timezone offset is missing, UTC (Z) will be automatically appended. Required. |
| `time_min` | string | Yes | Lower bound (inclusive) for an event's end time to filter by. Must be an RFC3339 timestamp with mandatory time zone offset (e.g., 2011-06-03T10:00:00-07:00 or 2011-06-03T10:00:00Z). If timezone offset is missing, UTC (Z) will be automatically appended. Required. |
| `event_types` | array | No | Event types to return. Optional. |
| `calendar_ids` | array | No | Optional list of specific calendar IDs to query. If not provided, all calendars from the user's calendar list will be queried. |
| `show_deleted` | boolean | No | Whether to include deleted events (with status equals 'cancelled') in the result. Optional. The default is False. |
| `single_events` | boolean | No | Whether to expand recurring events into instances and only return single one-off events and instances of recurring events. Optional. The default is True. |
| `max_results_per_calendar` | integer | No | Maximum number of events returned per calendar. Optional. If not provided, defaults to the API's default (250). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Move Event

**Slug:** `GOOGLECALENDAR_EVENTS_MOVE`

Moves an event to another calendar, i.e., changes an event's organizer.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event_id` | string | Yes | Event identifier. To retrieve event identifiers call the events.list method. |
| `calendar_id` | string | Yes | Calendar identifier of the source calendar. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `destination` | string | Yes | Calendar identifier of the destination calendar. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `send_updates` | string ("all" | "externalOnly" | "none") | No | Options for who should receive notifications about event changes. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Watch Events

**Slug:** `GOOGLECALENDAR_EVENTS_WATCH`

Watch for changes to Events resources.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | A UUID or similar unique string that identifies this channel. |
| `type` | string | No | The type of delivery mechanism used for this channel. |
| `token` | string | No | An arbitrary string delivered to the target address with each notification delivered over this channel. Optional. |
| `params` | object | No | Additional parameters controlling delivery channel behavior. Optional. |
| `address` | string | Yes | The address where notifications are delivered for this channel. |
| `payload` | boolean | No | A Boolean value to indicate whether payload is wanted. Optional. |
| `calendarId` | string | Yes | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Find event

**Slug:** `GOOGLECALENDAR_FIND_EVENT`

Finds events in a specified Google Calendar using text query, time ranges (event start/end, last modification), and event types; ensure `timeMin` is not chronologically after `timeMax` if both are provided.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | No | Free-text search terms to find events. This query is matched against various event fields including summary, description, location, attendees' details (displayName, email), and organizer's details. |
| `timeMax` | string | No | Upper bound (exclusive) for an event's start time to filter by. Only events starting before this time are included. Accepts multiple formats: 1. RFC3339 timestamp (e.g., '2024-12-06T13:00:00Z') 2. Comma-separated date/time parts (e.g., '2024,12,06,13,00,00') 3. Simple datetime string (e.g., '2024-12-06 13:00:00') |
| `timeMin` | string | No | Lower bound (exclusive) for an event's end time to filter by. Only events ending after this time are included. Accepts multiple formats: 1. RFC3339 timestamp (e.g., '2024-12-06T13:00:00Z') 2. Comma-separated date/time parts (e.g., '2024,12,06,13,00,00') 3. Simple datetime string (e.g., '2024-12-06 13:00:00') |
| `order_by` | string | No | Order of events: 'startTime' (ascending by start time) or 'updated' (ascending by last modification time). Note: 'startTime' requires single_events=true. Use 'updated' if you need to include recurring masters (e.g., cancelled series). |
| `page_token` | string | No | Token from a previous response's `nextPageToken` to fetch the subsequent page of results. |
| `calendar_id` | string | No | Identifier of the Google Calendar to query. IMPORTANT: This must be a valid calendar identifier, NOT a calendar name/title. Valid formats are: 'primary' (the authenticated user's primary calendar), an email address (e.g., 'user@example.com'), or a calendar ID (e.g., 'abc123xyz@group.calendar.google.com'). To find the calendar ID for a named calendar, first use the List Calendars action (GOOGLECALENDAR_LIST_CALENDARS) to retrieve all available calendars with their IDs. |
| `event_types` | array | No | Event types to include. Supported values: 'birthday', 'default', 'focusTime', 'outOfOffice', 'workingLocation'. |
| `max_results` | integer | No | Maximum number of events per page (1-2500). |
| `updated_min` | string | No | Lower bound (exclusive) for an event's last modification time to filter by. Only events updated after this time are included. When specified, events deleted since this time are also included, regardless of the `show_deleted` parameter. Accepts multiple formats: 1. RFC3339 timestamp (e.g., '2024-12-06T13:00:00Z') 2. Comma-separated date/time parts (e.g., '2024,12,06,13,00,00') 3. Simple datetime string (e.g., '2024-12-06 13:00:00') |
| `show_deleted` | boolean | No | Include events whose status is 'cancelled'. This surfaces cancelled/deleted events, not a separate 'trash' view. Behavior with recurring events: when single_events=true, only individual cancelled instances are returned (the recurring master is omitted); to include cancelled recurring masters, set single_events=false. If updated_min is provided, events deleted since that time are included regardless of this flag. |
| `single_events` | boolean | No | When true, recurring event series are expanded into their individual instances. When false, only the recurring master events are returned. Note: Ordering by 'startTime' requires singleEvents=true. For large calendars, it is strongly recommended to specify both timeMin and timeMax to limit the expansion window and improve performance. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Find free slots

**Slug:** `GOOGLECALENDAR_FIND_FREE_SLOTS`

Finds both free and busy time slots in Google Calendars for specified calendars within a defined time range. If `time_min` is not provided, defaults to the current timestamp in the specified timezone. If `time_max` is not provided, defaults to 23:59:59 of the day specified in `time_min` (if provided), otherwise defaults to 23:59:59 of the current day in the specified timezone. Returns busy intervals and calculates free slots by finding gaps between busy periods; `time_min` must precede `time_max` if both are provided. This action retrieves free and busy time slots for the specified calendars over a given time period. It analyzes the busy intervals from the calendars and provides calculated free slots based on the gaps in the busy periods.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `items` | array | No | List of calendar identifiers to query for free/busy information. Pass as a simple list of strings, e.g., ['primary'] or ['primary', 'user@example.com']. Valid values include: 'primary' (authenticated user's main calendar), calendar IDs from the user's calendar list (typically ending in @group.calendar.google.com), or email addresses of users whose free/busy information you want to query. The FreeBusy API will return error information for any calendars that are not accessible or invalid in the response under the 'errors' key for each calendar. |
| `time_max` | string | No | End datetime for the query interval. Accepts ISO, comma-separated, or simple datetime formats. If provided without an explicit timezone, it is interpreted in the specified `timezone`. If not provided, defaults to 23:59:59 of the day specified in `time_min` (if provided), otherwise defaults to 23:59:59 of the current day in the specified `timezone`. Maximum span between time_min and time_max is approximately 90 days per Google Calendar freeBusy API limit. |
| `time_min` | string | No | Start datetime for the query interval. Accepts ISO, comma-separated, or simple datetime formats. If provided without an explicit timezone, it is interpreted in the specified `timezone`. If not provided, defaults to the current timestamp in the specified `timezone` to ensure only future/bookable slots are returned. Maximum span between time_min and time_max is approximately 90 days per Google Calendar freeBusy API limit. |
| `timezone` | string | No | IANA timezone identifier (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo'). Determines how naive `time_min`/`time_max` are interpreted and the timezone used in the response for `timeMin`, `timeMax`, busy periods, and calculated free slots. Note: 'local' is not supported; use a specific IANA timezone name. |
| `group_expansion_max` | integer | No | Maximum calendar identifiers to return for a single group. Must be between 1 and 100 (inclusive). Values exceeding 100 will be rejected. |
| `calendar_expansion_max` | integer | No | Maximum calendars for which FreeBusy information is provided. Must be between 1 and 50 (inclusive). Values exceeding 50 will be rejected. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Query Free/Busy Information

**Slug:** `GOOGLECALENDAR_FREE_BUSY_QUERY`

Returns free/busy information for a set of calendars.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `items` | array | Yes | List of calendars and/or groups to query. Accepts either strings (e.g., ['primary', 'user@example.com']) or objects with an 'id' field (e.g., [{'id': 'primary'}]). String values are automatically converted to the proper format. |
| `timeMax` | string | Yes | The end of the interval for the query formatted as per RFC3339. |
| `timeMin` | string | Yes | The start of the interval for the query formatted as per RFC3339. |
| `timeZone` | string | No | Time zone used in the response. Optional. The default is UTC. |
| `groupExpansionMax` | integer | No | Maximal number of calendar identifiers to be provided for a single group. Optional. An error is returned for a group with more members than this value. Maximum value is 100. |
| `calendarExpansionMax` | integer | No | Maximal number of calendars for which FreeBusy information is to be provided. Optional. Maximum value is 50. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Google Calendar

**Slug:** `GOOGLECALENDAR_GET_CALENDAR`

Retrieves a specific Google Calendar, identified by `calendar_id`, to which the authenticated user has access.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendar_id` | string | No | Identifier of the Google Calendar to retrieve. Must be 'primary' (the default) for the user's main calendar, or an email-like identifier (e.g., 'user@example.com' or 'en.usa#holiday@group.v.calendar.google.com'). IMPORTANT: Calendar display names/titles (e.g., 'Work', 'Vacation') are NOT valid identifiers and will result in errors. To find a calendar's ID, use the LIST_CALENDARS action which returns the 'id' field for each calendar. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Calendar Profile

**Slug:** `GOOGLECALENDAR_GET_CALENDAR_PROFILE`

Tool to retrieve the authenticated user's primary calendar profile. Use when you need to get information about the user's main calendar, including timezone, settings, and preferences.

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get current date and time

**Slug:** `GOOGLECALENDAR_GET_CURRENT_DATE_TIME`

Gets the current date and time, allowing for a specific timezone offset.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `timezone` | string | No | Timezone specification. Accepts: (1) IANA timezone identifier (e.g., 'America/New_York', 'Asia/Kolkata', 'Europe/London') - RECOMMENDED, (2) Common timezone abbreviations (e.g., 'PST', 'EST', 'CST', 'GMT', 'UTC') - will be auto-converted to IANA, or (3) Numeric UTC offset in hours (e.g., -5, 5.5). Use positive values for east of UTC, negative for west. Default 0 is UTC. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List ACL Rules

**Slug:** `GOOGLECALENDAR_LIST_ACL_RULES`

Retrieves the list of access control rules (ACLs) for a specified calendar, providing the necessary 'rule_id' values required for updating specific ACL rules.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page_token` | string | No | Token specifying which result page to return. Optional. |
| `sync_token` | string | No | Token obtained from the nextSyncToken field returned on the last page of a previous list operation. It makes the result of this list operation contain only entries that have changed since then. Optional. The default is to retrieve all entries. |
| `calendar_id` | string | Yes | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `max_results` | integer | No | Maximum number of entries returned on one result page. Optional. The default is 100. |
| `show_deleted` | boolean | No | Whether to include deleted ACLs in the result. Optional. The default is False. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Google Calendars

**Slug:** `GOOGLECALENDAR_LIST_CALENDARS`

Retrieves calendars from the user's Google Calendar list, with options for pagination and filtering.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page_token` | string | No | Token for the page of results to return, from a previous response. |
| `sync_token` | string | No | Sync token from a previous list request to get only changed entries; showDeleted, showHidden, and pageToken are ignored if provided. |
| `max_results` | integer | No | Maximum number of calendars to return per page. Max 250. |
| `show_hidden` | boolean | No | Include calendars not typically shown in the UI. |
| `show_deleted` | boolean | No | Include deleted calendars in the result. |
| `min_access_role` | string | No | Minimum access role for calendars returned. Valid values are 'freeBusyReader', 'owner', 'reader', 'writer'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Calendar Settings

**Slug:** `GOOGLECALENDAR_LIST_SETTINGS`

Tool to return all user settings for the authenticated user. Use when you need to retrieve calendar settings.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageToken` | string | No | Token for pagination to retrieve subsequent result pages |
| `maxResults` | integer | No | Maximum number of settings to return |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Patch Calendar

**Slug:** `GOOGLECALENDAR_PATCH_CALENDAR`

Partially updates (PATCHes) an existing Google Calendar, modifying only the fields provided; `summary` is mandatory and cannot be an empty string, and an empty string for `description` or `location` clears them.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `summary` | string | Yes | New title for the calendar; cannot be an empty string. |
| `location` | string | No | New geographic location of the calendar (e.g., 'Paris, France'). |
| `timezone` | string | No | New IANA Time Zone Database name for the calendar (e.g., 'Europe/Zurich', 'America/New_York'). |
| `calendar_id` | string | Yes | The unique identifier of the Google Calendar to update. Use 'primary' for the main calendar, or a calendar's unique ID (typically in email format like 'abc123@group.calendar.google.com'). IMPORTANT: This is NOT the calendar's display name/title - use GOOGLECALENDAR_LIST_CALENDARS to find the 'id' field for a calendar. |
| `description` | string | No | New description for the calendar. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Patch Event

**Slug:** `GOOGLECALENDAR_PATCH_EVENT`

Update specified fields of an existing event in a Google Calendar using patch semantics (array fields like `attendees` are fully replaced if provided); ensure the `calendar_id` and `event_id` are valid and the user has write access to the calendar.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `summary` | string | No | New title for the event. |
| `end_time` | string | No | New end time (RFC3339 timestamp, e.g., '2024-07-01T11:00:00-07:00'). Uses `timezone` if provided, otherwise UTC. For all-day events, use YYYY-MM-DD format (exclusive end date). Optional when updating start_time - the original event duration will be preserved if end_time is not specified. |
| `event_id` | string | Yes | The unique technical identifier of the event to update. IMPORTANT: This is NOT the event title/name. Event IDs are opaque strings typically base32hex encoded (5-1024 characters using lowercase a-v and digits 0-9). For recurring event instances, the ID format is 'baseEventId_YYYYMMDDTHHMMSSZ' with an underscore separator (e.g., 'abc123def456_20260115T100000Z'). To get an event ID, first use GOOGLECALENDAR_FIND_EVENT or GOOGLECALENDAR_EVENTS_LIST to search for events and retrieve their IDs. |
| `location` | string | No | New geographic location (physical address or virtual meeting link). |
| `timezone` | string | No | IANA Time Zone Database name for start/end times (e.g., 'America/Los_Angeles'). Used if `start_time` and `end_time` are provided and not all-day dates; defaults to UTC if unset. |
| `attendees` | array | No | List of valid email addresses for attendees (e.g., 'user@example.com'). Replaces existing attendees. Provide an empty list to remove all. |
| `start_time` | string | No | New start time (RFC3339 timestamp, e.g., '2024-07-01T10:00:00-07:00'). Uses `timezone` if provided, otherwise UTC. For all-day events, use YYYY-MM-DD format. When only start_time is provided without end_time, the event's original duration is preserved automatically. |
| `calendar_id` | string | Yes | Identifier of the calendar. Use 'primary' for the primary calendar of the logged-in user. To find other calendar IDs, use the `calendarList.list` method. Must be provided in snake_case format. |
| `description` | string | No | New description for the event; can include HTML. |
| `send_updates` | string | No | Whether to send update notifications to attendees: 'all', 'externalOnly', or 'none'. Uses default user behavior if unspecified. |
| `max_attendees` | integer | No | Maximum attendees in response; does not affect invited count. If more, response includes organizer only. Must be positive. |
| `rsvp_response` | string | No | RSVP response status for the authenticated user. Updates only the current user's response status without affecting other attendees. Possible values: 'needsAction', 'declined', 'tentative', 'accepted'. Note: RSVP is only supported for regular calendar events (eventType='default'); attempting to RSVP to focusTime, outOfOffice, birthday, or workingLocation events will result in an error. |
| `supports_attachments` | boolean | No | Client application supports event attachments. Set to `True` if so. |
| `conference_data_version` | integer | No | API client's conference data support version. Set to 1 to manage conference details (e.g., Google Meet links); 0 (default) ignores conference data. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Quick Add Event

**Slug:** `GOOGLECALENDAR_QUICK_ADD`

Parses natural language text to quickly create a basic Google Calendar event with its title, date, and time, suitable for simple scheduling; does not support direct attendee addition or recurring events, and `calendar_id` must be valid if not 'primary'.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | No | Natural language input describing the event; Google Calendar parses this for event details like title, date, and time. |
| `calendar_id` | string | No | Identifier of the calendar for the event. Use 'primary' for the main calendar, or provide a specific calendar ID (e.g., email address). |
| `send_updates` | string ("all" | "externalOnly" | "none") | No | Controls whether email notifications about the event creation are sent to attendees. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Remove attendee from event

**Slug:** `GOOGLECALENDAR_REMOVE_ATTENDEE`

Removes an attendee from a specified event in a Google Calendar; the calendar and event must exist.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event_id` | string | Yes | Unique identifier of the event. |
| `calendar_id` | string | No | Identifier of the Google Calendar to which the event belongs; 'primary' signifies the user's main calendar. |
| `attendee_email` | string | Yes | Email address of the attendee to remove. Must match an attendee email present on the event. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Calendar Setting

**Slug:** `GOOGLECALENDAR_SETTINGS_GET`

Tool to return a single user setting for the authenticated user. Use when you need to retrieve a specific calendar setting value.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `setting` | string | Yes | The identifier of the user setting to retrieve. Valid values include: autoAddHangouts, dateFieldOrder, defaultEventLength, format24HourTime, hideInvitations, hideWeekends, locale, remindOnRespondedEventsOnly, showDeclinedEvents, timezone, useKeyboardShortcuts, weekStart |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Settings

**Slug:** `GOOGLECALENDAR_SETTINGS_LIST`

Returns all user settings for the authenticated user.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageToken` | string | No | Token specifying which result page to return. |
| `syncToken` | string | No | Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. If the syncToken expires, the server will respond with a 410 GONE response code and the client should clear its storage and perform a full synchronization without any syncToken. |
| `maxResults` | integer | No | Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Watch Settings

**Slug:** `GOOGLECALENDAR_SETTINGS_WATCH`

Watch for changes to Settings resources.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | A UUID or similar unique string that identifies this channel. |
| `type` | string | Yes | The type of delivery mechanism used for this channel. Must be "web_hook". |
| `token` | string | No | An arbitrary string delivered to the target address with each notification delivered over this channel. |
| `params` | object | No | Additional parameters controlling delivery channel behavior. |
| `address` | string | Yes | The address where notifications are delivered for this channel. |
| `expiration` | integer | No | Unix timestamp in milliseconds specifying when the API should stop sending notifications for this channel. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Sync Events

**Slug:** `GOOGLECALENDAR_SYNC_EVENTS`

Synchronizes Google Calendar events, performing a full sync if no `sync_token` is provided or if a 410 GONE error (due to an expired token) necessitates it, otherwise performs an incremental sync for events changed since the `sync_token` was issued.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageToken` | string | No | Token for paginating results, from a previous response's `nextPageToken`. |
| `sync_token` | string | No | Token for incremental sync, retrieving only changes since issued. A 410 GONE response indicates an expired token, requiring a full sync. |
| `calendar_id` | string | No | Google Calendar identifier; 'primary' refers to the authenticated user's main calendar. |
| `event_types` | array | No | Filters events by specified types (e.g., 'default', 'focusTime', 'outOfOffice', 'workingLocation'). All types returned if omitted. |
| `max_results` | integer | No | Max events per page (max 2500); Google Calendar's default is used if unspecified. |
| `single_events` | boolean | No | If True, expands recurring events into individual instances (excluding master event); otherwise, Google's default handling applies. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update ACL Rule

**Slug:** `GOOGLECALENDAR_UPDATE_ACL_RULE`

Updates an access control rule for the specified calendar.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `role` | string | Yes | The role assigned to the scope. Possible values are: - "none" - Provides no access. - "freeBusyReader" - Provides read access to free/busy information. - "reader" - Provides read access to the calendar. Private events will appear to users with reader access, but event details will be hidden. - "writer" - Provides read and write access to the calendar. Private events will appear to users with writer access, and event details will be visible. - "owner" - Provides ownership of the calendar. This role has all of the permissions of the writer role with the additional ability to see and manipulate ACLs. |
| `rule_id` | string | Yes | ACL rule identifier. |
| `calendar_id` | string | Yes | Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword. |
| `send_notifications` | boolean | No | Whether to send notifications about the calendar sharing change. Note that there are no notifications on access removal. Optional. The default is True. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Google event

**Slug:** `GOOGLECALENDAR_UPDATE_EVENT`

Updates an existing event in Google Calendar. REQUIRES event_id - you MUST first search for the event using GOOGLECALENDAR_FIND_EVENT or GOOGLECALENDAR_EVENTS_LIST to obtain the event_id. This is a full PUT replacement, so provide all desired fields as unspecified ones may be cleared or reset.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `summary` | string | No | Summary (title) of the event. |
| `event_id` | string | Yes | REQUIRED. The unique identifier of the event to update. This parameter is MANDATORY - events cannot be updated by title, date, or other criteria. You MUST first retrieve the event_id by using GOOGLECALENDAR_FIND_EVENT or GOOGLECALENDAR_EVENTS_LIST to search for the event, then use the returned 'id' field here. |
| `location` | string | No | Geographic location of the event as free-form text. |
| `timezone` | string | No | IANA timezone name from the timezone database (e.g., 'America/New_York', 'Europe/London', 'Asia/Jerusalem', 'UTC'). Required if datetime is naive. For recurring events, start and end must include a timeZone. If not provided, UTC is used. If datetime includes timezone info (Z or offset), this field is optional and defaults to UTC. IMPORTANT: Must be a valid IANA timezone identifier. Values like 'EST', 'PST', 'ISRAEL TIME', or other abbreviations are NOT valid IANA timezone names. |
| `attendees` | array | No | List of attendee email addresses. IMPORTANT: Only email addresses are accepted (e.g., 'user@example.com'). Plain names like 'John' or 'Andrew' cannot be used - you must provide the full email address. This tool does not resolve names to email addresses. |
| `eventType` | string ("birthday" | "default" | "focusTime" | "outOfOffice" | "workingLocation") | No | Type of the event, immutable post-creation. 'workingLocation' (REQUIRES Google Workspace Enterprise). Note: 'fromGmail' events cannot be created via API. |
| `recurrence` | array | No | List of RRULE, EXRULE, RDATE, EXDATE lines for recurring events. Supported frequencies: DAILY, WEEKLY, MONTHLY, YEARLY. For recurring events, start.timeZone and end.timeZone must be present. UNTIL values follow RFC 5545: date-only (YYYYMMDD) for all-day events, or UTC datetime with Z suffix (YYYYMMDDTHHMMSSZ) for timed events. UNTIL values with time but missing Z suffix are auto-corrected. Provide an empty list to remove recurrence so the event becomes non-recurring. |
| `visibility` | string ("default" | "public" | "private" | "confidential") | No | Event visibility: 'default', 'public', 'private', or 'confidential'. |
| `calendar_id` | string | No | Identifier of the Google Calendar where the event resides. The value 'primary' targets the user's primary calendar. |
| `description` | string | No | Description of the event. Can contain HTML. Optional. Must be omitted for 'birthday' event type. |
| `send_updates` | boolean | No | Defaults to True. Whether to send updates to the attendees. |
| `transparency` | string ("opaque" | "transparent") | No | 'opaque' (busy) or 'transparent' (available). |
| `start_datetime` | string | Yes | REQUIRED. Event start time in ISO 8601 format: YYYY-MM-DDTHH:MM:SS. IMPORTANT: Natural language expressions like 'tomorrow', 'next Monday', '2pm tomorrow' are NOT supported and will be rejected. You must provide the exact date and time in ISO format. Fractional seconds (e.g., .000) and timezone info (Z, +, -) will be automatically stripped if provided. Examples: '2025-01-16T13:00:00', '2025-01-16T13:00'. |
| `guests_can_modify` | boolean | No | If True, guests can modify the event. |
| `birthdayProperties` | object | No | Properties for birthday events. |
| `create_meeting_room` | boolean | No | Defaults to True. When True, for CREATE operations creates a Google Meet link; for UPDATE operations preserves existing conference data if present, or adds a new Meet link if none exists. Google Workspace accounts will successfully receive a Meet link. Personal Gmail accounts and other unsupported accounts will gracefully fallback to creating an event without a Meet link when conference creation fails. Set to False to skip Meet link operations (won't create new or modify existing conference data). The fallback ensures event creation succeeds even when conference features are unavailable due to account limitations. |
| `event_duration_hour` | integer | No | Number of hours for the event duration. Supports multi-day events (e.g., 240 hours = 10 days). For durations under 1 hour, use event_duration_minutes instead. |
| `extended_properties` | object | No | Extended properties of the event for storing custom metadata. Contains 'private' (visible only on this calendar) and/or 'shared' (visible to all attendees) dictionaries mapping string keys to string values. Example: {'private': {'key1': 'value1'}, 'shared': {'key2': 'value2'}} |
| `focusTimeProperties` | object | No | Properties for focusTime events. REQUIRES Google Workspace Enterprise account with Focus Time feature enabled. |
| `guestsCanInviteOthers` | boolean | No | Whether attendees other than the organizer can invite others to the event. |
| `outOfOfficeProperties` | object | No | Properties for outOfOffice events. |
| `event_duration_minutes` | integer | No | Duration in minutes (0-59 ONLY). NEVER use 60+ minutes - use event_duration_hour=1 instead. Maximum value is 59. Combined duration (hours + minutes) must be greater than 0. |
| `guestsCanSeeOtherGuests` | boolean | No | Whether attendees other than the organizer can see who the event's attendees are. |
| `workingLocationProperties` | object | No | Properties for workingLocation events. REQUIRES Google Workspace Enterprise. Constraints discovered from testing: - Must set transparency='transparent' and visibility='public' - Description must be omitted - Depending on 'type', include one of 'homeOffice', 'officeLocation', or 'customLocation' |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

## Triggers

### Attendee Response Changed

**Slug:** `GOOGLECALENDAR_ATTENDEE_RESPONSE_CHANGED_TRIGGER`

**Type:** poll

Polling trigger that fires when any attendee's RSVP changes to
accepted, declined, or tentative. Returns attendee info and current status.

#### Configuration

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendarId` | string | No | The unique identifier for the calendar |
| `interval` | number | No | Periodic Interval to Check for Updates & Send a Trigger in Minutes |
| `showDeleted` | boolean | No | Whether to include deleted events in the results |

#### Payload

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `attendee_email` | string | No | Email of the attendee whose RSVP changed |
| `attendee_name` | string | No | Display name of the attendee |
| `calendar_id` | string | Yes | The calendar identifier |
| `event_html_link` | string | No | Link to the event in Google Calendar |
| `event_id` | string | Yes | The unique identifier of the event |
| `event_summary` | string | No | Event title/summary |
| `previous_response_status` | string | No | Previous RSVP status |
| `response_status` | string | Yes | Current RSVP status (accepted, declined, tentative) |

### Event Canceled or Deleted

**Slug:** `GOOGLECALENDAR_EVENT_CANCELED_DELETED_TRIGGER`

**Type:** poll

Triggers when a Google Calendar event is cancelled or deleted.
Returns minimal data: event_id, summary (if available), and cancellation timestamp.

#### Configuration

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendarId` | string | No | The unique identifier for the calendar to monitor |
| `interval` | number | No | Periodic Interval to Check for Updates & Send a Trigger in Minutes |

#### Payload

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cancelled_at` | string | No | Cancellation timestamp (from event.updated) |
| `event_id` | string | Yes | The unique identifier of the event |
| `summary` | string | No | Event title/summary (may be missing for cancelled events) |

### Event Starting Soon

**Slug:** `GOOGLECALENDAR_EVENT_STARTING_SOON_TRIGGER`

**Type:** poll

Triggers when a calendar event is within a configured number of minutes from starting.
Includes countdown window, start time, and event metadata.

#### Configuration

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendarId` | string | No | The unique identifier for the calendar to monitor |
| `countdown_window_minutes` | integer | No | Look-ahead window (in minutes) for upcoming events to evaluate |
| `include_all_day` | boolean | No | Whether to consider all-day events (default False) |
| `interval` | number | No | Periodic Interval to Check for Updates & Send a Trigger in Minutes |
| `minutes_before_start` | integer | No | Trigger when an event is within this many minutes from starting |

#### Payload

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `attendees` | array | No | List of attendees |
| `calendar_id` | string | Yes | The calendar identifier |
| `countdown_window_minutes` | integer | Yes | Countdown window used for this trigger |
| `creator_email` | string | No | Email of the event creator |
| `description` | string | No | Event description |
| `event_id` | string | Yes | The unique identifier of the event |
| `hangout_link` | string | No | Google Meet link for the conference, if available |
| `html_link` | string | No | Link to the event in Google Calendar |
| `location` | string | No | Event location |
| `minutes_until_start` | number | No | Minutes remaining until event starts (>= 0) |
| `organizer_email` | string | No | Email of the event organizer |
| `start_time` | string | No | Event start time in ISO format |
| `start_timestamp` | number | No | Event start time as UNIX epoch timestamp (UTC) |
| `summary` | string | No | Event title/summary |

### Calendar Event Changes

**Slug:** `GOOGLECALENDAR_GOOGLE_CALENDAR_EVENT_CHANGE_TRIGGER`

**Type:** webhook

**SOON TO BE DEPRECATED** - Use Calendar Event Sync (polling trigger) instead.
Real-time webhook trigger for calendar event changes. Returns event metadata only.
For full event data, use Calendar Event Sync (polling trigger).

#### Configuration

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendar_id` | string | No | The unique identifier for the calendar |
| `ttl` | integer | No | The time-to-live in seconds for the notification channel |

#### Payload

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channel_id` | string | Yes | The unique identifier passed to identify this channel |
| `resource_id` | string | Yes | The unique identifier of the resource |
| `resource_state` | string | Yes | The state of the resource |
| `resource_url` | string | Yes | The url for the resource |

### Event Created

**Slug:** `GOOGLECALENDAR_GOOGLE_CALENDAR_EVENT_CREATED_TRIGGER`

**Type:** poll

Polling trigger that fires when a new calendar event is created.
Returns event ID, summary, start/end times, and organizer info.

#### Configuration

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendarId` | string | No | The unique identifier for the calendar |
| `interval` | number | No | Periodic Interval to Check for Updates & Send a Trigger in Minutes |
| `showDeleted` | boolean | No | Whether to include deleted events in the results |

#### Payload

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendar_id` | string | Yes | The calendar identifier |
| `end_time` | string | No | Event end time in ISO format |
| `event_id` | string | Yes | The unique identifier of the event |
| `organizer_email` | string | No | Email of the event organizer |
| `organizer_name` | string | No | Name of the event organizer |
| `start_time` | string | No | Event start time in ISO format |
| `summary` | string | No | Event title/summary |

### Calendar Event Sync

**Slug:** `GOOGLECALENDAR_GOOGLE_CALENDAR_EVENT_SYNC_TRIGGER`

**Type:** poll

Polling trigger that returns full event data including details, attendees, and metadata.
For real-time notifications with basic info, use Calendar Event Changes (webhook).

#### Configuration

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendarId` | string | No | The unique identifier for the calendar |
| `interval` | number | No | Periodic Interval to Check for Updates & Send a Trigger in Minutes |
| `showDeleted` | boolean | No | Whether to include deleted events in the results |

#### Payload

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `attendees` | array | No | List of attendees |
| `calendar_id` | string | Yes | The calendar identifier |
| `conference_data` | object | No | Conference data structure containing details about the meeting |
| `created_at` | string | No | When the event was created |
| `creator_email` | string | No | Email of the event creator |
| `creator_name` | string | No | Name of the event creator |
| `description` | string | No | Event description |
| `end_time` | string | No | Event end time in ISO format |
| `event_id` | string | Yes | The unique identifier of the event |
| `event_type` | string | Yes | Type of change: created, updated, or deleted |
| `hangout_link` | string | No | Google Meet link for the conference, if available |
| `html_link` | string | No | Link to the event in Google Calendar |
| `location` | string | No | Event location |
| `organizer_email` | string | No | Email of the event organizer |
| `organizer_name` | string | No | Name of the event organizer |
| `recurring_event_id` | string | No | ID of recurring event if applicable |
| `start_time` | string | No | Event start time in ISO format |
| `status` | string | No | Event status (confirmed, tentative, cancelled) |
| `summary` | string | No | Event title/summary |
| `updated_at` | string | No | When the event was last updated |
| `visibility` | string | No | Event visibility |

### Event Updated

**Slug:** `GOOGLECALENDAR_GOOGLE_CALENDAR_EVENT_UPDATED_TRIGGER`

**Type:** poll

Triggers when an existing Google Calendar event is modified. Returns the event ID,
change type, and the specific fields that changed with their previous and new values.

#### Configuration

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendarId` | string | No | The unique identifier for the calendar |
| `interval` | number | No | Periodic Interval to Check for Updates & Send a Trigger in Minutes |
| `showDeleted` | boolean | No | Whether to include deleted (cancelled) events in the results |
| `tracked_fields` | array | No | List of event fields to track for changes. start and end are compared as RFC3339 strings (preferring dateTime over date). Attendees are compared by email, displayName, responseStatus, and optional flag. |

#### Payload

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calendar_id` | string | Yes | The calendar identifier |
| `change_type` | string | No | Type of change. Always 'updated' for this trigger |
| `event_id` | string | Yes | The unique identifier of the event |
| `updated_at` | string | No | When the event was last updated (RFC3339) |
| `updated_fields` | object | Yes | Dictionary of changed fields with old and new values |

# Google Sheets

Google Sheets is a cloud-based spreadsheet tool enabling real-time collaboration, data analysis, and integration with other Google Workspace apps

- **Category:** spreadsheets
- **Auth:** OAUTH2
- **Tools:** 44
- **Triggers:** 2
- **Slug:** `GOOGLESHEETS`
- **Version:** 20260211_00

## Frequently Asked Questions

### How do I set up custom Google OAuth credentials for Google Sheets?

For a step-by-step guide on creating and configuring your own Google OAuth credentials with Composio, see [How to create OAuth2 credentials for Google Apps](https://composio.dev/auth/googleapps).

## Tools

### Add Sheet to Existing Spreadsheet

**Slug:** `GOOGLESHEETS_ADD_SHEET`

Adds a new sheet to a spreadsheet. Supports three sheet types: GRID, OBJECT, and DATA_SOURCE. SHEET TYPES: - GRID (default): Standard spreadsheet with rows/columns. Use properties to set dimensions, tab color, etc. - OBJECT: Sheet containing a chart. Requires objectSheetConfig with chartSpec (basicChart or pieChart). - DATA_SOURCE: Sheet connected to BigQuery. Requires dataSourceConfig with bigQuery spec and bigquery.readonly OAuth scope. OTHER NOTES: - Sheet names must be unique; use forceUnique=true to auto-append suffix (_2, _3) if name exists - For tab colors, use EITHER rgbColor OR themeColor, not both - Avoid 'index' when creating sheets in parallel (causes errors) - OBJECT sheets are created via addChart with position.newSheet=true - DATA_SOURCE sheets require bigquery.readonly OAuth scope Use cases: Add standard grid sheet, create chart on dedicated sheet, connect to BigQuery data source.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | No | The name for the new sheet tab. Must be unique within the spreadsheet. Example: "Q3 Report", "Sales Data 2025". This is a convenience parameter - alternatively, you can set this via properties.title. Note: sheet_name is also accepted as an alias for title. |
| `properties` | object | No | Advanced sheet properties (grid dimensions, tab color, position, etc.). For simple cases, just use the 'title' parameter directly. Use this for additional customization. |
| `forceUnique` | boolean | No | When True (default), automatically ensures the sheet name is unique by appending a numeric suffix (e.g., '_2', '_3') if the requested name already exists. This makes the action resilient to retries and parallel workflows. When False, the action fails with an error if a sheet with the same name already exists. |
| `spreadsheetId` | string | Yes | REQUIRED. Cannot be empty. The ID of the target spreadsheet where the new sheet will be added. This is the long alphanumeric string in the Google Sheet URL (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'). Use 'Search Spreadsheets' action to find the spreadsheet ID by name if you don't have it. |
| `dataSourceConfig` | object | No | Configuration for creating a DATA_SOURCE sheet. DATA_SOURCE sheets connect to external data sources like BigQuery. The API uses addDataSource request which automatically creates the associated sheet. IMPORTANT: Requires additional OAuth scope: bigquery.readonly |
| `objectSheetConfig` | object | No | Configuration for creating an OBJECT sheet (a sheet containing a chart). To create an OBJECT sheet, you must provide chart configuration. The API uses addChart with position.newSheet=true to create the chart on its own sheet. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Aggregate Column Data

**Slug:** `GOOGLESHEETS_AGGREGATE_COLUMN_DATA`

Searches for rows where a specific column matches a value and performs mathematical operations on data from another column.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `operation` | string ("sum" | "average" | "count" | "min" | "max" | "percentage") | Yes | The mathematical operation to perform on the target column values. |
| `sheet_name` | string | Yes | The name of the specific sheet within the spreadsheet. Matching is case-insensitive. If no exact match is found, partial matches will be attempted (e.g., 'overview' will match 'Overview 2025'). |
| `search_value` | string | No | The exact value to search for in the search column. Case-sensitive by default. If not provided (or if search_column is not provided), all rows in the target column will be aggregated without filtering. |
| `search_column` | string | No | The column to search in for filtering rows. Can be a letter (e.g., 'A', 'B') or column name from header row (e.g., 'Region', 'Department'). If not provided, all rows in the target column will be aggregated without filtering. |
| `target_column` | string | Yes | The column to aggregate data from. Can be a letter (e.g., 'C', 'D') or column name from header row (e.g., 'Sales', 'Revenue'). |
| `case_sensitive` | boolean | No | Whether the search should be case-sensitive. |
| `has_header_row` | boolean | No | Whether the first row contains column headers. If True, column names can be used for search_column and target_column. |
| `spreadsheet_id` | string | Yes | The unique identifier of the Google Sheets spreadsheet. |
| `percentage_total` | number | No | For percentage operation, the total value to calculate percentage against. If not provided, uses sum of all values in target column. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Append Dimension

**Slug:** `GOOGLESHEETS_APPEND_DIMENSION`

Tool to append new rows or columns to a sheet, increasing its size. Use when you need to add empty rows or columns to an existing sheet.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `length` | integer | Yes | The number of rows or columns to append. |
| `sheet_id` | integer | Yes | The numeric ID of the sheet (not the sheet name). This is a non-negative integer found in the sheet's URL as the 'gid' parameter (e.g., gid=0) or in the sheet properties. The first sheet in a spreadsheet typically has sheet_id=0. |
| `dimension` | string ("ROWS" | "COLUMNS") | Yes | Specifies whether to append rows or columns. |
| `spreadsheet_id` | string | Yes | The ID of the spreadsheet. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Batch get spreadsheet

**Slug:** `GOOGLESHEETS_BATCH_GET`

Retrieves data from specified cell ranges in a Google Spreadsheet.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ranges` | array | No | A list of cell ranges in A1 notation from which to retrieve data. If this list is omitted, empty, or contains only empty strings, all data from the first sheet of the spreadsheet will be fetched. Empty strings in the list are automatically filtered out. Supported formats: (1) Bare sheet name like 'Sheet1' to get all data from that sheet, (2) Sheet with range like 'Sheet1!A1:B2', (3) Just cell reference like 'A1:B2' (uses first sheet). For sheet names with spaces or special characters, enclose in single quotes (e.g., "'My Sheet'" or "'My Sheet'!A1:B2"). IMPORTANT: For large sheets, always use bounded ranges with explicit row limits (e.g., 'Sheet1!A1:Z10000' instead of 'Sheet1!A:Z'). Unbounded column ranges like 'A:Z' on sheets with >10,000 rows may cause timeouts or errors. If you need all data from a large sheet, fetch in chunks of 10,000 rows at a time. |
| `spreadsheet_id` | string | Yes | The unique identifier of the Google Spreadsheet from which data will be retrieved. This is the ID found in the spreadsheet URL after /d/. You can provide either the spreadsheet ID directly or a full Google Sheets URL (the ID will be extracted automatically). |
| `valueRenderOption` | string ("FORMATTED_VALUE" | "UNFORMATTED_VALUE" | "FORMULA") | No | How values should be rendered in the output. FORMATTED_VALUE: Values are calculated and formatted (default). UNFORMATTED_VALUE: Values are calculated but not formatted. FORMULA: Values are not calculated; the formula is returned instead. |
| `dateTimeRenderOption` | string ("SERIAL_NUMBER" | "FORMATTED_STRING") | No | How dates and times should be rendered in the output. SERIAL_NUMBER: Dates are returned as serial numbers (default). FORMATTED_STRING: Dates returned as formatted strings. |
| `empty_strings_filtered` | boolean | No | |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Batch update spreadsheet

**Slug:** `GOOGLESHEETS_BATCH_UPDATE`

Write values to ONE range in a Google Sheet, or append as new rows if no start cell is given. IMPORTANT - This tool does NOT accept the Google Sheets API's native batch format: - WRONG: {"data": [{"range": "...", "values": [[...]]}], ...} - CORRECT: {"sheet_name": "...", "values": [[...]], "first_cell_location": "...", ...} To update MULTIPLE ranges, make SEPARATE CALLS to this tool for each range. Features: - Auto-expands grid for large datasets (prevents range errors) - Set first_cell_location to write at a specific position (e.g., "A1", "B5") - Omit first_cell_location to append values as new rows at the end Requirements: Target sheet must exist and spreadsheet must contain at least one worksheet.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `values` | array | Yes | A 2D array of cell values where each inner array represents a row. Values can be strings, numbers, booleans, or None/null for empty cells. Ensure columns are properly aligned across rows. |
| `sheet_name` | string | Yes | The name of the specific sheet (tab) within the spreadsheet to update. Case-insensitive matching is supported (e.g., 'sheet1' will match 'Sheet1'). Note: Default sheet names are locale-dependent (e.g., 'Sheet1' in English, 'Foglio1' in Italian, 'Hoja 1' in Spanish, '시트1' in Korean, 'Feuille 1' in French). If you specify a common default name like 'Sheet1' and it doesn't exist, the action will automatically use the first sheet in the spreadsheet. |
| `spreadsheet_id` | string | Yes | The unique identifier of the Google Sheets spreadsheet to be updated. Must be an alphanumeric string (with hyphens and underscores allowed) typically 44 characters long. Can be found in the spreadsheet URL between '/d/' and '/edit'. Example: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit' has ID '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'. |
| `valueInputOption` | string ("RAW" | "USER_ENTERED") | No | How input data should be interpreted. 'USER_ENTERED': Values are parsed as if typed by a user (e.g., strings may become numbers/dates, formulas are calculated). 'RAW': Values are stored exactly as provided without parsing (e.g., '123' stays as string, '=SUM(A1:B1)' is not calculated). |
| `first_cell_location` | string | No | The starting cell for the update range, specified in A1 notation (e.g., 'A1', 'B2'). The update will extend from this cell to the right and down, based on the provided values. If omitted or set to null, values are appended as new rows to the sheet. Note: No placeholder value is needed - simply omit this field or set it to null to trigger append mode. |
| `includeValuesInResponse` | boolean | No | If set to True, the response will include the updated values in the 'spreadsheet.responses[].updatedData' field. The updatedData object contains 'range' (A1 notation), 'majorDimension' (ROWS), and 'values' (2D array of the actual cell values after the update). |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Batch Update Values by Data Filter

**Slug:** `GOOGLESHEETS_BATCH_UPDATE_VALUES_BY_DATA_FILTER`

Tool to update values in ranges matching data filters. Use when you need to update specific data in a Google Sheet based on criteria rather than fixed cell ranges.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | array | Yes | The new values to apply to the spreadsheet. If more than one range is matched by the specified DataFilter the specified values are applied to all of those ranges. Can be provided as a JSON string or as a list of DataFilterValueRange objects. |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet to update. |
| `valueInputOption` | string ("RAW" | "USER_ENTERED") | Yes | How the input data should be interpreted. |
| `includeValuesInResponse` | boolean | No | Determines if the update response should include the values of the cells that were updated. By default, responses do not include the updated values. |
| `responseValueRenderOption` | string ("FORMATTED_VALUE" | "UNFORMATTED_VALUE" | "FORMULA") | No | Determines how values in the response should be rendered. The default render option is FORMATTED_VALUE. |
| `responseDateTimeRenderOption` | string ("SERIAL_NUMBER" | "FORMATTED_STRING") | No | Determines how dates, times, and durations in the response should be rendered. This is ignored if responseValueRenderOption is FORMATTED_VALUE. The default dateTime render option is SERIAL_NUMBER. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Clear Basic Filter

**Slug:** `GOOGLESHEETS_CLEAR_BASIC_FILTER`

Tool to clear the basic filter from a sheet. Use when you need to remove an existing basic filter from a specific sheet within a Google Spreadsheet.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sheet_id` | integer | Yes | The ID of the sheet on which the basic filter should be cleared. |
| `spreadsheet_id` | string | Yes | The ID of the spreadsheet. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Clear spreadsheet values

**Slug:** `GOOGLESHEETS_CLEAR_VALUES`

Clears cell content (preserving formatting and notes) from a specified A1 notation range in a Google Spreadsheet; the range must correspond to an existing sheet and cells.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `range` | string | Yes | The A1 notation of the range to clear values from (e.g., 'Sheet1!A1:B2', 'MySheet!C:C', or 'A1:D5'). If the sheet name is omitted (e.g., 'A1:B2'), the operation applies to the first visible sheet. |
| `spreadsheet_id` | string | Yes | The unique identifier of the Google Spreadsheet from which to clear values. This ID can be found in the URL of the spreadsheet. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create Chart in Google Sheets

**Slug:** `GOOGLESHEETS_CREATE_CHART`

Create a chart in a Google Sheets spreadsheet using the specified data range and chart type. Conditional requirements: - Provide either a simple chart via chart_type + data_range (basicChart), OR supply a full chart_spec supporting all chart types. Exactly one approach should be used. - When using chart_spec, set exactly one of the union fields (basicChart | pieChart | bubbleChart | candlestickChart | histogramChart | waterfallChart | treemapChart | orgChart | scorecardChart).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | No | Optional title for the chart. |
| `sheet_id` | integer | Yes | The numeric sheetId (not the sheet name/title) of the worksheet where the chart will be created. This is a unique integer identifier for the sheet within the spreadsheet. The first/default sheet typically has sheetId=0. IMPORTANT: Use 'Get Spreadsheet Info' action to retrieve valid sheetIds - look for sheets[].properties.sheetId in the response. The sheetId must exist in the target spreadsheet; using an ID from a different spreadsheet will fail. |
| `subtitle` | string | No | Optional subtitle for the chart. |
| `chart_spec` | object | No | Optional full ChartSpec object to send to the Google Sheets API. Use this to support ALL chart types and advanced options. Must set exactly one of: basicChart, pieChart, bubbleChart, candlestickChart, histogramChart, treemapChart, waterfallChart, orgChart, scorecardChart. See https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/charts#ChartSpec. |
| `chart_type` | string | Yes | The type of chart to create. Case-insensitive. Supported types: BAR, LINE, AREA, COLUMN, SCATTER, COMBO, STEPPED_AREA (basic charts with axes), PIE (pie/donut charts), HISTOGRAM, BUBBLE, CANDLESTICK (requires 4+ data columns for low/open/close/high), TREEMAP, WATERFALL, ORG (organizational charts), SCORECARD. Each chart type uses its appropriate Google Sheets API spec structure. For advanced customization, provide chart_spec instead. |
| `data_range` | string | Yes | A single contiguous range of data for the chart in A1 notation (e.g., 'A1:C10' or 'Sheet1!B2:D20'). Must be a single continuous range - comma-separated multi-ranges (e.g., 'A1:A10,C1:C10') are not supported. When chart_spec is not provided, the first column is used as the domain/labels and the remaining columns as series. IMPORTANT: PIE charts require at least 2 columns - the first column for category labels (domain) and the second column for numeric values (series). Single-column ranges are not supported for PIE charts. |
| `x_axis_title` | string | No | Optional title for the X-axis. |
| `y_axis_title` | string | No | Optional title for the Y-axis. |
| `background_red` | number | No | Red component of chart background color (0.0-1.0). If not specified, uses default. |
| `spreadsheet_id` | string | Yes | The unique identifier of the Google Sheets spreadsheet where the chart will be created. Must be the actual spreadsheet ID from the URL (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'), NOT the spreadsheet name or title. Find it in the URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit |
| `background_blue` | number | No | Blue component of chart background color (0.0-1.0). If not specified, uses default. |
| `legend_position` | string | No | Position of the chart legend. Options: BOTTOM_LEGEND, TOP_LEGEND, LEFT_LEGEND, RIGHT_LEGEND, NO_LEGEND. |
| `background_green` | number | No | Green component of chart background color (0.0-1.0). If not specified, uses default. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create a Google Sheet

**Slug:** `GOOGLESHEETS_CREATE_GOOGLE_SHEET1`

Creates a new Google Spreadsheet in Google Drive. If a title is provided, the spreadsheet will be created with that name. If no title is provided, Google will create a spreadsheet with a default name like 'Untitled spreadsheet'.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | No | The title for the new Google Sheet. If omitted, Google will create a spreadsheet with a default name like 'Untitled spreadsheet'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create spreadsheet column

**Slug:** `GOOGLESHEETS_CREATE_SPREADSHEET_COLUMN`

Creates a new column in a Google Spreadsheet. Specify the target sheet using sheet_id (numeric) or sheet_name (text). If neither is provided, defaults to the first sheet (sheet_id=0).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sheet_id` | integer | No | The numeric identifier of the specific sheet (tab) within the spreadsheet. Defaults to 0 (the first sheet) if neither sheet_id nor sheet_name is provided. Use GOOGLESHEETS_GET_SHEET_NAMES or GOOGLESHEETS_FIND_WORKSHEET_BY_TITLE to obtain the sheet_id from a sheet name. |
| `sheet_name` | string | No | The name (title) of the sheet/tab where the column will be added. If provided, the action will look up the sheet_id automatically. If both sheet_id and sheet_name are provided, sheet_id takes precedence. |
| `insert_index` | integer | No | The 0-based index at which the new column will be inserted. For example, an index of 0 inserts the column before the current first column (A), and an index of 1 inserts it between the current columns A and B. |
| `spreadsheet_id` | string | Yes | The unique identifier of the Google Spreadsheet where the column will be created. |
| `inherit_from_before` | boolean | No | If true, the new column inherits properties (e.g., formatting, width) from the column immediately to its left (the preceding column). If false (default), it inherits from the column immediately to its right (the succeeding column). This is ignored if there is no respective preceding or succeeding column. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create spreadsheet row

**Slug:** `GOOGLESHEETS_CREATE_SPREADSHEET_ROW`

Inserts a new, empty row into a specified sheet of a Google Spreadsheet at a given index, optionally inheriting formatting from the row above.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sheet_id` | integer | No | The numeric identifier of the sheet (tab) within the spreadsheet where the row will be inserted. This ID (gid) is found in the URL of the spreadsheet (e.g., '0' for the first sheet). Either sheet_id or sheet_name must be provided. |
| `sheet_name` | string | No | The human-readable name of the sheet (tab) within the spreadsheet where the row will be inserted (e.g., 'Sheet1'). Either sheet_id or sheet_name must be provided. If both are provided, sheet_id takes precedence. |
| `insert_index` | integer | No | The 0-based index at which the new row should be inserted. For example, an index of 0 inserts the row at the beginning of the sheet. If the index is greater than the current number of rows, the row is appended. |
| `spreadsheet_id` | string | Yes | The unique identifier of the Google Spreadsheet. Can be provided as the ID (e.g., '1qpyC0XzHc_-_d824s2VfopkHh7D0jW4aXCS1D_AlGA') or as a full URL (the ID will be extracted automatically). |
| `inherit_from_before` | boolean | No | If True, the newly inserted row will inherit formatting and properties from the row immediately preceding its insertion point. If False, it will have default formatting. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete Dimension (Rows/Columns)

**Slug:** `GOOGLESHEETS_DELETE_DIMENSION`

Tool to delete specified rows or columns from a sheet in a Google Spreadsheet. Use when you need to remove a range of rows or columns.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sheet_id` | integer | No | The unique numeric ID of the sheet (not the index/position). This ID is assigned by Google Sheets and does not change when sheets are reordered. Use GOOGLESHEETS_GET_SPREADSHEET_INFO to find the sheet ID, or use sheet_name instead. Either sheet_id or sheet_name must be provided. |
| `dimension` | string ("ROWS" | "COLUMNS") | No | The dimension to delete (ROWS or COLUMNS). |
| `end_index` | integer | No | The zero-based end index of the range to delete, exclusive. Must be greater than start_index and at most equal to the sheet's current row/column count. Note: Cannot delete all rows or columns from a sheet - at least one row and one column must remain. |
| `sheet_name` | string | No | The name/title of the sheet from which to delete the dimension. Using sheet_name is recommended as it's more intuitive than sheet_id. Either sheet_id or sheet_name must be provided. |
| `start_index` | integer | No | The zero-based start index of the range to delete, inclusive. Must be less than end_index and within the sheet's current row/column count. Note: Cannot delete all rows or columns from a sheet - at least one row and one column must remain. |
| `spreadsheet_id` | string | Yes | The ID of the spreadsheet. |
| `response_ranges` | array | No | Limits the ranges of cells included in the response spreadsheet. |
| `delete_dimension_request` | object | No | The details for the delete dimension request object. |
| `response_include_grid_data` | boolean | No | True if grid data should be returned. This parameter is ignored if a field mask was set in the request. |
| `include_spreadsheet_in_response` | boolean | No | Determines if the update response should include the spreadsheet resource. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Delete Sheet

**Slug:** `GOOGLESHEETS_DELETE_SHEET`

Tool to delete a sheet (worksheet) from a spreadsheet. Use when you need to remove a specific sheet from a Google Sheet document.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sheet_id` | integer | Yes | The ID of the sheet to delete. Note: A spreadsheet must contain at least one sheet, so you cannot delete the last remaining sheet. If the sheet is of DATA_SOURCE type, the associated DataSource is also deleted. |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet from which to delete the sheet. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Execute SQL on Spreadsheet

**Slug:** `GOOGLESHEETS_EXECUTE_SQL`

Execute SQL queries against Google Sheets tables. Supports SELECT, INSERT, UPDATE, DELETE operations and WITH clauses (CTEs) with familiar SQL syntax. Tables are automatically detected and mapped from the spreadsheet structure.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sql` | string | Yes | Complete SQL query to execute. Must begin with SELECT, INSERT, UPDATE, DELETE, or WITH. Supports Common Table Expressions (CTEs) using WITH clause for complex queries. Note: WITH clauses require the sqlglot library for full support; simple SELECT/INSERT/UPDATE/DELETE operations work without it. Use table names (sheet names) in FROM/INTO clauses, not A1 range notation. The query must include proper SQL clauses (e.g., SELECT columns FROM table, not just a column name or condition). Example: SELECT * FROM "Sheet1" WHERE A = 'value' (correct) instead of just A = 'value' (incorrect). |
| `dry_run` | boolean | No | Preview changes without applying them (for write operations) |
| `delete_method` | string ("clear" | "remove_rows") | No | For DELETE operations: 'clear' preserves row structure, 'remove_rows' shifts data up |
| `spreadsheet_id` | string | Yes | The unique alphanumeric ID of the Google Spreadsheet extracted from the URL. Format: A long string of letters, numbers, hyphens, and underscores (typically 44 characters). Find it in the URL: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit. Must be a valid ID - values like 'auto' are NOT valid and will fail. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Find and Replace in Spreadsheet

**Slug:** `GOOGLESHEETS_FIND_REPLACE`

Tool to find and replace text in a Google Spreadsheet. Use when you need to fix formula errors, update values, or perform bulk text replacements across cells. Common use cases: - Fix #ERROR! cells by replacing with empty string or correct formula - Update old values with new ones across multiple cells - Fix formula references or patterns - Clean up data formatting issues

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `find` | string | Yes | The text to find. Can be a literal string or a regular expression pattern. |
| `range` | string | No | A1 notation range string to search within (e.g., 'A1:B10', 'Sheet1!A1:B10'). When using A1 notation with a sheet name, you must also provide range_sheet_id to specify the numeric sheet ID (the API requires numeric IDs). Alternatively, use the GridRange parameters (range_sheet_id with optional row/column indices) for explicit numeric control. Mutually exclusive with sheet_id and all_sheets. |
| `replace` | string | Yes | The text to replace the found instances with. |
| `sheetId` | integer | No | The numeric ID of the sheet to search the entire sheet (e.g., 0 for the first sheet). Mutually exclusive with sheet_name, range/range_sheet_id parameters, and all_sheets. You must specify exactly one scope: either sheet_id (entire sheet), sheet_name, range/range_sheet_id (specific range), or all_sheets. |
| `allSheets` | boolean | No | Whether to search across all sheets in the spreadsheet. Mutually exclusive with sheet_id and range parameters. |
| `matchCase` | boolean | No | Whether the search should be case-sensitive. |
| `sheetName` | string | No | The name/title of the sheet (tab) to search within (e.g., 'Sheet1', 'Sales Data'). The sheet name will be resolved to its numeric sheet ID. Mutually exclusive with sheet_id, range/range_sheet_id parameters, and all_sheets. |
| `endRowIndex` | integer | No | The end row (0-indexed, exclusive) of the range. Only used when range_sheet_id is provided without a 'range' parameter. |
| `rangeSheetId` | integer | No | The numeric sheet ID for a GridRange-based search. Required when using the 'range' parameter with A1 notation. Can also be used alone or with row/column index parameters to define a specific range. Mutually exclusive with sheet_id and all_sheets. |
| `searchByRegex` | boolean | No | Whether to treat the find text as a regular expression. |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet to update. |
| `startRowIndex` | integer | No | The start row (0-indexed, inclusive) of the range. Only used when range_sheet_id is provided without a 'range' parameter. |
| `endColumnIndex` | integer | No | The end column (0-indexed, exclusive) of the range. Column A = 0, B = 1, etc. Only used when range_sheet_id is provided without a 'range' parameter. |
| `matchEntireCell` | boolean | No | Whether to match only cells that contain the entire search term. |
| `startColumnIndex` | integer | No | The start column (0-indexed, inclusive) of the range. Column A is index 0, B is index 1, etc. Only used when range_sheet_id is provided without a 'range' parameter. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Find worksheet by title

**Slug:** `GOOGLESHEETS_FIND_WORKSHEET_BY_TITLE`

Finds a worksheet by its exact, case-sensitive title within a Google Spreadsheet; returns a boolean indicating if found and the matched worksheet's metadata when found, or None when not found.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spreadsheet_id` | string | Yes | The unique identifier of the Google Spreadsheet. This ID can be found in the spreadsheet's URL (e.g., https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit). Must be a resolved, actual ID - not a template variable or placeholder reference. Valid IDs typically contain alphanumeric characters, hyphens, and underscores. |
| `worksheet_title` | string | Yes | The exact, case-sensitive title of the worksheet (tab name) to find. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Format cell

**Slug:** `GOOGLESHEETS_FORMAT_CELL`

Applies text and background cell formatting to a specified range in a Google Sheets worksheet.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `red` | number | No | Red component of the background color (0.0-1.0). |
| `blue` | number | No | Blue component of the background color (0.0-1.0). |
| `bold` | boolean | No | Apply bold formatting. |
| `green` | number | No | Green component of the background color (0.0-1.0). |
| `range` | string | No | OPTION 1: Cell range in A1 notation (RECOMMENDED). Supports: single cells ('A1', 'F9'), cell ranges ('A1:B5'), entire columns ('A', 'I:J'), entire rows ('1', '1:5'). Provide EITHER this field OR all four index fields below, not both. |
| `italic` | boolean | No | Apply italic formatting. |
| `fontSize` | integer | No | Font size in points. |
| `underline` | boolean | No | Apply underline formatting. |
| `sheet_name` | string | No | The worksheet name/title (e.g., 'Sheet1', 'Q3 Report'). Provide either this field OR worksheet_id, not both. If both are provided, sheet_name takes precedence and will be resolved to worksheet_id. |
| `worksheet_id` | integer | No | The worksheet identifier. Accepts EITHER: (1) The sheetId from the Google Sheets API (a large number like 1534097477, obtainable via GOOGLESHEETS_GET_SPREADSHEET_INFO), OR (2) The 0-based positional index of the worksheet (0 for first sheet, 1 for second, etc.). The action will first try to match by sheetId, then fall back to matching by index. Defaults to 0 (first sheet). Provide either this field OR sheet_name, not both. |
| `end_row_index` | integer | No | OPTION 2: 0-based index of the row AFTER the last row (exclusive). Required if 'range' is not provided. Must provide ALL four index fields together. |
| `strikethrough` | boolean | No | Apply strikethrough formatting. |
| `spreadsheet_id` | string | Yes | Identifier of the Google Sheets spreadsheet. |
| `start_row_index` | integer | No | OPTION 2: 0-based row index (row 1 = index 0, row 9 = index 8). Required if 'range' is not provided. Must provide ALL four index fields together. |
| `end_column_index` | integer | No | OPTION 2: 0-based index of the column AFTER the last column (exclusive). Required if 'range' is not provided. Must provide ALL four index fields together. |
| `start_column_index` | integer | No | OPTION 2: 0-based column index (A = 0, B = 1, F = 5). Required if 'range' is not provided. Must provide ALL four index fields together. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get conditional format rules

**Slug:** `GOOGLESHEETS_GET_CONDITIONAL_FORMAT_RULES`

List conditional formatting rules for each sheet (or a selected sheet) in a normalized, easy-to-edit form. Use when you need to view, audit, or prepare to modify conditional format rules.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sheet_id` | integer | No | Optional filter: return rules only for the sheet with this exact numeric sheetId. If not provided, returns rules for all sheets. If both sheet_title and sheet_id are provided, sheet_id takes precedence. |
| `sheet_title` | string | No | Optional filter: return rules only for the sheet with this exact title. If not provided, returns rules for all sheets. |
| `spreadsheet_id` | string | Yes | Unique identifier of the Google Spreadsheet, typically found in its URL. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Data Validation Rules

**Slug:** `GOOGLESHEETS_GET_DATA_VALIDATION_RULES`

Tool to extract data validation rules from a Google Sheets spreadsheet. Use when you need to understand dropdown lists, allowed values, custom formulas, or other validation constraints for cells.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ranges` | array | No | Optional list of A1 ranges to scan. If omitted, the entire sheet(s) will be scanned. WARNING: Scanning entire large sheets may be slow. |
| `sheetId` | integer | No | Optional sheet ID to filter by. If omitted, all sheets will be scanned. |
| `sheetTitle` | string | No | Optional sheet title to filter by. If omitted, all sheets will be scanned. |
| `includeEmpty` | boolean | No | If true, include cells without validation rules in the output. Default is false. |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet to request. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get sheet names

**Slug:** `GOOGLESHEETS_GET_SHEET_NAMES`

Lists all worksheet names from a specified Google Spreadsheet (which must exist), useful for discovering sheets before further operations.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spreadsheet_id` | string | Yes | The unique identifier of the Google Spreadsheet (alphanumeric string, typically 44 characters). Extract only the ID portion from URLs - do not include leading/trailing slashes, '/edit' suffixes, query parameters, or URL fragments. From 'https://docs.google.com/spreadsheets/d/1qpyC0XzvTcKT6EISywY/edit#gid=0', use only '1qpyC0XzvTcKT6EISywY'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Spreadsheet by Data Filter

**Slug:** `GOOGLESHEETS_GET_SPREADSHEET_BY_DATA_FILTER`

Returns the spreadsheet at the given ID, filtered by the specified data filters. Use this tool when you need to retrieve specific subsets of data from a Google Sheet based on criteria like A1 notation, developer metadata, or grid ranges. Important: This action is designed for filtered data retrieval. While it accepts empty filters and returns full metadata in that case, GOOGLESHEETS_GET_SPREADSHEET_INFO is the recommended action for unfiltered spreadsheet retrieval.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dataFilters` | array | No | The DataFilters used to select which ranges to retrieve. Supports A1 notation (e.g., 'Sheet1!A1:B2'), developer metadata lookup, or grid range filters. If empty or omitted, returns full spreadsheet metadata. Recommended: Use GOOGLESHEETS_GET_SPREADSHEET_INFO for unfiltered retrieval as it is the dedicated action for that purpose. |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet to request. |
| `includeGridData` | boolean | No | True if grid data should be returned. Ignored if a field mask is set. |
| `excludeTablesInBandedRanges` | boolean | No | True if tables should be excluded in the banded ranges. False if not set. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get spreadsheet info

**Slug:** `GOOGLESHEETS_GET_SPREADSHEET_INFO`

Retrieves comprehensive metadata for a Google Spreadsheet using its ID, excluding cell data.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spreadsheet_id` | string | No | Required. The Google Sheets spreadsheet ID or full URL. Accepts either the ID alone (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms') or a full Google Sheets URL (e.g., 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit'). The ID will be automatically extracted from URLs. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get Table Schema

**Slug:** `GOOGLESHEETS_GET_TABLE_SCHEMA`

This action is used to get the schema of a table in a Google Spreadsheet, call this action to get the schema of a table in a spreadsheet BEFORE YOU QUERY THE TABLE. Analyze table structure and infer column names, types, and constraints. Uses statistical analysis of sample data to determine the most likely data type for each column. Call this action after calling the LIST_TABLES action to get the schema of a table in a spreadsheet.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sheet_name` | string | No | Sheet/tab name if table_name is ambiguous across multiple sheets |
| `table_name` | string | Yes | Table name from LIST_TABLES response OR the visible Google Sheets tab name (e.g., 'Sales Data', 'Projections'). Use 'auto' to analyze the largest/most prominent table. |
| `sample_size` | integer | No | Number of rows to sample for type inference |
| `spreadsheet_id` | string | Yes | The unique identifier of the Google Spreadsheet. Must be a valid Google Sheets ID (typically a 44-character alphanumeric string). Do NOT use 'auto' - only 'table_name' supports auto-detection. You can get this ID from the spreadsheet URL or from SEARCH_SPREADSHEETS action. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Insert Dimension in Google Sheet

**Slug:** `GOOGLESHEETS_INSERT_DIMENSION`

Tool to insert new rows or columns into a sheet at a specified location. Use when you need to add empty rows or columns within an existing Google Sheet.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spreadsheet_id` | string | Yes | The ID of the spreadsheet to update. |
| `response_ranges` | array | No | Limits the ranges of the spreadsheet to include in the response. |
| `insert_dimension` | object | Yes | The details for the insert dimension request. |
| `response_include_grid_data` | boolean | No | True if grid data should be included in the response (if includeSpreadsheetInResponse is true). |
| `include_spreadsheet_in_response` | boolean | No | True if the updated spreadsheet should be included in the response. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### List Tables in Spreadsheet

**Slug:** `GOOGLESHEETS_LIST_TABLES`

This action is used to list all tables in a Google Spreadsheet, call this action to get the list of tables in a spreadsheet. Discover all tables in a Google Spreadsheet by analyzing sheet structure and detecting data patterns. Uses heuristic analysis to find header rows, data boundaries, and table structures.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `min_rows` | integer | No | Minimum number of data rows to consider a valid table |
| `min_columns` | integer | No | Minimum number of columns to consider a valid table |
| `min_confidence` | number | No | Minimum confidence score (0.0-1.0) to consider a valid table |
| `spreadsheet_id` | string | Yes | The actual Google Spreadsheet ID (not a placeholder or spreadsheet name). Find it in the spreadsheet URL: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit. It is the alphanumeric string between '/d/' and '/edit' (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'). IMPORTANT: Do NOT pass the spreadsheet name - only pass the alphanumeric ID from the URL. Do NOT pass template placeholders like '{{spreadsheet_id}}', '<spreadsheet_id>', or 'your-spreadsheet-id-here'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Look up spreadsheet row

**Slug:** `GOOGLESHEETS_LOOKUP_SPREADSHEET_ROW`

Finds the first row in a Google Spreadsheet where a cell's entire content exactly matches the query string, searching within a specified A1 notation range or the first sheet by default.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Exact text value to find; matches the entire content of a cell in a row. |
| `range` | string | No | A1 notation range to search within. Supports cell ranges (e.g., 'Sheet1!A1:D5'), column-only ranges (e.g., 'Sheet1!A:Z'), and row-only ranges (e.g., 'Sheet1!1:1'). Defaults to the first sheet if omitted. IMPORTANT: Sheet names with spaces must be single-quoted (e.g., "'My Sheet'!A1:Z"). Bare sheet names without ranges (e.g., 'Sheet1') are not supported - always specify a range. |
| `case_sensitive` | boolean | No | If `True`, the query string search is case-sensitive. |
| `spreadsheet_id` | string | Yes | Identifier of the Google Spreadsheet to search. |
| `normalize_whitespace` | boolean | No | If `True`, strips leading and trailing whitespace from cell values before matching. This helps match cells like ' TOTAL ' or 'TOTAL ' when searching for 'TOTAL'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Mutate conditional format rules

**Slug:** `GOOGLESHEETS_MUTATE_CONDITIONAL_FORMAT_RULES`

Add, update, delete, or reorder conditional format rules on a Google Sheet. Use when you need to create, modify, or remove conditional formatting without manually building batchUpdate requests. Supports four operations: ADD (create new rule), UPDATE (replace existing rule), DELETE (remove rule), MOVE (reorder rules by changing index).

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `rule` | object | No | Conditional format rule specification. |
| `index` | integer | No | Zero-based index for the operation. Required for UPDATE, DELETE, MOVE. Optional for ADD (defaults to end of list). |
| `sheet_id` | integer | Yes | The unique numeric identifier of the sheet/tab to modify (NOT a zero-based index). This is a specific ID assigned by Google Sheets when the sheet is created, not the position of the sheet. You MUST first call GOOGLESHEETS_GET_SPREADSHEET_INFO to retrieve the actual sheetId values from the 'sheets' array in the response. Common mistake: Do not assume sheet_id=0 exists - while some spreadsheets may have a sheet with ID 0, many do not. |
| `new_index` | integer | No | Destination index for MOVE operation. Required when operation is MOVE. |
| `operation` | string ("ADD" | "UPDATE" | "DELETE" | "MOVE") | Yes | Operation type: ADD (add new rule), UPDATE (replace rule), DELETE (remove rule), MOVE (change rule order/index). |
| `spreadsheet_id` | string | Yes | The ID of the spreadsheet containing the sheet to modify. Found in the Google Sheets URL between '/d/' and '/edit'. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Query Spreadsheet Table

**Slug:** `GOOGLESHEETS_QUERY_TABLE`

Execute SQL-like SELECT queries against Google Spreadsheet tables. Table names correspond to sheet/tab names visible at the bottom of the spreadsheet. Use GOOGLESHEETS_LIST_TABLES first to discover available table names if unknown. Supports WHERE conditions, ORDER BY, LIMIT clauses.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sql` | string | Yes | SQL SELECT query. The table name is the Google Sheets tab/sheet name (visible at the bottom of the spreadsheet). Use GOOGLESHEETS_LIST_TABLES to discover available table names if unknown. Supported: SELECT cols FROM table WHERE conditions ORDER BY col LIMIT n. Table names must be quoted with double quotes if they contain spaces or are numeric-only (e.g., SELECT * FROM "My Sheet" or SELECT * FROM "415"). |
| `spreadsheet_id` | string | Yes | The unique identifier of a native Google Sheets file. Found in the spreadsheet URL after /d/ (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'). Only native Google Sheets files (MIME type: application/vnd.google-apps.spreadsheet) are supported. Files uploaded to Google Drive that are not native Google Sheets (such as Excel .xlsx files, PDFs, or Google Docs) will not work even if they can be viewed in Google Sheets. |
| `include_formulas` | boolean | No | Whether to return formula text instead of calculated values for formula columns |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Search Developer Metadata

**Slug:** `GOOGLESHEETS_SEARCH_DEVELOPER_METADATA`

Tool to search for developer metadata in a spreadsheet. Use when you need to find specific metadata entries based on filters.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dataFilters` | array | Yes | The data filters describing the criteria used to determine which DeveloperMetadata entries to return. |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet to retrieve metadata from. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Search Spreadsheets

**Slug:** `GOOGLESHEETS_SEARCH_SPREADSHEETS`

Search for Google Spreadsheets using various filters including name, content, date ranges, and more.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | No | Search query to filter spreadsheets. Behavior depends on the 'search_type' parameter. For advanced searches, use Google Drive query syntax with fields like 'name contains', 'fullText contains', or boolean filters like 'sharedWithMe = true'. DO NOT use spreadsheet IDs as search terms. Leave empty to get all spreadsheets. |
| `order_by` | string | No | Order results by field. Common options: 'modifiedTime desc', 'modifiedTime asc', 'name', 'createdTime desc' |
| `max_results` | integer | No | Maximum number of spreadsheets to return (1-1000). Defaults to 10. |
| `search_type` | string ("name" | "content" | "both") | No | How to search: 'name' searches filenames only (prefix matching from the START of filenames), 'content' uses fullText search which searches file content, name, description, and metadata (Google Drive API limitation: cannot search content exclusively without also matching filenames), 'both' explicitly searches both name OR content with an OR condition. Note: 'name' search only matches from the START of filenames (e.g., 'Budget' finds 'Budget 2024' but NOT 'Q1 Budget'). |
| `starred_only` | boolean | No | Whether to return only starred spreadsheets. Defaults to False. |
| `created_after` | string | No | Return spreadsheets created after this date. Use RFC 3339 format like '2024-01-01T00:00:00Z'. |
| `modified_after` | string | No | Return spreadsheets modified after this date. Use RFC 3339 format like '2024-01-01T00:00:00Z'. |
| `shared_with_me` | boolean | No | Whether to return only spreadsheets shared with the current user. Defaults to False. |
| `include_trashed` | boolean | No | Whether to include spreadsheets in trash. Defaults to False. |
| `include_shared_drives` | boolean | No | Whether to include spreadsheets from shared drives you have access to. Defaults to True. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Set Basic Filter

**Slug:** `GOOGLESHEETS_SET_BASIC_FILTER`

Tool to set a basic filter on a sheet in a Google Spreadsheet. Use when you need to filter or sort data within a specific range on a sheet.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `filter` | object | Yes | The filter to set. |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Set Data Validation Rule

**Slug:** `GOOGLESHEETS_SET_DATA_VALIDATION_RULE`

Tool to set or clear data validation rules (including dropdowns) on a range in Google Sheets. Use when you need to apply dropdown lists, range-based dropdowns, or custom formula validation to cells.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mode` | string ("SET" | "CLEAR") | Yes | Operation mode: 'SET' applies a validation rule to the range, 'CLEAR' removes any existing validation from the range. |
| `strict` | boolean | No | Whether to reject invalid data (true) or show a warning (false). Default is true. |
| `values` | array | No | List of allowed values for dropdown. Required when validation_type='ONE_OF_LIST'. Each item becomes a dropdown option. |
| `formula` | string | No | Custom formula for validation. Required when validation_type='CUSTOM_FORMULA'. Formula should evaluate to TRUE/FALSE. Example: '=A1>10'. |
| `sheet_id` | integer | Yes | The unique sheet ID (numeric identifier) where the validation rule will be applied. The first sheet created in a spreadsheet typically has ID 0, while additional sheets get unique IDs (e.g., 1534097477). If a sheet is deleted, its ID is never reused - so if the original first sheet (ID 0) was deleted, attempting to use 0 will fail. Always verify the actual sheet ID exists using GOOGLESHEETS_GET_SPREADSHEET_INFO action (check 'sheets[].properties.sheetId' field). |
| `end_row_index` | integer | Yes | Ending row index (0-based, exclusive) for the validation range. To apply to row 1 only, use start_row_index=0 and end_row_index=1. |
| `input_message` | string | No | Optional message shown to the user when they select the cell. Helpful hint about what values are expected. |
| `show_custom_ui` | boolean | No | Whether to show a dropdown UI for list-based validation. Default is true. Set to true for dropdown lists. |
| `spreadsheet_id` | string | Yes | The unique identifier of the Google Sheets spreadsheet. Can be found in the spreadsheet URL between '/d/' and '/edit'. |
| `source_range_a1` | string | No | Source range in A1 notation for dropdown values. Required when validation_type='ONE_OF_RANGE'. Example: 'Sheet1!A1:A10' or 'A1:A10'. |
| `start_row_index` | integer | Yes | Starting row index (0-based, inclusive) for the validation range. Row 1 is index 0. |
| `validation_type` | string ("ONE_OF_LIST" | "ONE_OF_RANGE" | "CUSTOM_FORMULA") | No | Type of validation rule to apply. Required when mode='SET'. 'ONE_OF_LIST': dropdown from list of values. 'ONE_OF_RANGE': dropdown from range. 'CUSTOM_FORMULA': custom formula validation. |
| `end_column_index` | integer | Yes | Ending column index (0-based, exclusive) for the validation range. To apply to column A only, use start_column_index=0 and end_column_index=1. |
| `start_column_index` | integer | Yes | Starting column index (0-based, inclusive) for the validation range. Column A is index 0. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Create sheet from JSON

**Slug:** `GOOGLESHEETS_SHEET_FROM_JSON`

Creates a new Google Spreadsheet and populates its first worksheet from `sheet_json`. When data is provided, the first item's keys establish the headers. An empty list creates an empty worksheet.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | The desired title for the new Google Spreadsheet. |
| `sheet_json` | array | Yes | A list of dictionaries representing the rows of the sheet. Each dictionary must have the same set of keys, which will form the header row. Values can be strings, numbers, booleans, or null (represented as empty cells). An empty list [] is allowed and will create a spreadsheet with an empty worksheet. |
| `sheet_name` | string | Yes | The name for the first worksheet within the newly created spreadsheet. This name will appear as a tab at the bottom of the sheet. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Copy Sheet to Another Spreadsheet

**Slug:** `GOOGLESHEETS_SPREADSHEETS_SHEETS_COPY_TO`

Tool to copy a single sheet from a spreadsheet to another spreadsheet. Use when you need to duplicate a sheet into a different spreadsheet.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sheet_id` | integer | Yes | The ID of the sheet to copy. |
| `spreadsheet_id` | string | Yes | The ID of the spreadsheet containing the sheet to copy. |
| `destination_spreadsheet_id` | string | Yes | The ID of the spreadsheet to copy the sheet to. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Append Values to Spreadsheet

**Slug:** `GOOGLESHEETS_SPREADSHEETS_VALUES_APPEND`

Tool to append values to a spreadsheet. Use when you need to add new data to the end of an existing table in a Google Sheet.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `range` | string | Yes | A1 notation range used to locate a logical table. New rows are appended after the last row of that table within this range. Valid formats: sheet name only (e.g., 'Sheet1'), column range (e.g., 'Sheet1!A:D'), or cell range (e.g., 'Sheet1!A1:D100'). Per Google Sheets API documentation, sheet names with spaces or special characters require single quotes (e.g., "'Email Summary'!A:E", "'Jon's Data'!A1:D5"). Sheet names without spaces/special characters don't need quotes (e.g., 'Sheet1!A:D'). You can provide ranges with or without quotes—the action will add them automatically when needed. The sheet name must exist in the spreadsheet; a non-existent sheet will cause an 'Unable to parse range' error. Check updates.updatedRange in the response for where values were written. |
| `values` | array | Yes | 2D array of values to append. Typically, each inner list is a ROW (majorDimension=ROWS). Use null/None for empty cells. |
| `spreadsheetId` | string | Yes | The spreadsheet ID (typically 44 characters containing letters, numbers, hyphens, and underscores). Found in the URL between /d/ and /edit. NOT the sheet name (tab name) - that belongs in the 'range' parameter. |
| `majorDimension` | string ("ROWS" | "COLUMNS") | No | How to interpret the 2D values array. Use ROWS for row-wise data (most common for appends). Use COLUMNS for column-wise data. Example: if A1=1,B1=2,A2=3,B2=4 then majorDimension=ROWS yields [[1,2],[3,4]] and majorDimension=COLUMNS yields [[1,3],[2,4]]. |
| `insertDataOption` | string ("OVERWRITE" | "INSERT_ROWS") | No | How the input data should be inserted. |
| `valueInputOption` | string ("RAW" | "USER_ENTERED") | Yes | How the input data should be interpreted. |
| `includeValuesInResponse` | boolean | No | Determines if the update response should include the values of the cells that were appended. By default, responses do not include the updated values. |
| `responseValueRenderOption` | string ("FORMATTED_VALUE" | "UNFORMATTED_VALUE" | "FORMULA") | No | Determines how values in the response should be rendered. The default render option is FORMATTED_VALUE. |
| `responseDateTimeRenderOption` | string ("SERIAL_NUMBER" | "FORMATTED_STRING") | No | Determines how dates, times, and durations in the response should be rendered. This is ignored if responseValueRenderOption is FORMATTED_VALUE. The default dateTime render option is SERIAL_NUMBER. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Batch Clear Spreadsheet Values

**Slug:** `GOOGLESHEETS_SPREADSHEETS_VALUES_BATCH_CLEAR`

Tool to clear one or more ranges of values from a spreadsheet. Use when you need to remove data from specific cells or ranges while keeping formatting and other properties intact.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ranges` | array | Yes | The ranges to clear, in A1 notation (e.g., 'Sheet1!A1:B2') or R1C1 notation. Each range should be a clean string without surrounding brackets or extra quotes. Valid examples: 'Sheet1!A1:B2', 'A1:Z100', 'Sheet1'. Invalid examples: "['Sheet1!A1:B2']", '[Sheet1!A1]'. |
| `spreadsheet_id` | string | Yes | The ID of the spreadsheet to update. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Batch Clear Values By Data Filter

**Slug:** `GOOGLESHEETS_SPREADSHEETS_VALUES_BATCH_CLEAR_BY_DATA_FILTER`

Clears one or more ranges of values from a spreadsheet using data filters. The caller must specify the spreadsheet ID and one or more DataFilters. Ranges matching any of the specified data filters will be cleared. Only values are cleared -- all other properties of the cell (such as formatting, data validation, etc..) are kept.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dataFilters` | array | Yes | The DataFilters used to determine which ranges to clear. |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet to update. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Batch Get Spreadsheet Values by Data Filter

**Slug:** `GOOGLESHEETS_SPREADSHEETS_VALUES_BATCH_GET_BY_DATA_FILTER`

Tool to return one or more ranges of values from a spreadsheet that match the specified data filters. Use when you need to retrieve specific data sets based on filtering criteria rather than entire sheets or fixed ranges.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dataFilters` | array | Yes | Required. An array of data filter objects used to match ranges of values to retrieve. Each filter can specify either 'a1Range' (e.g., 'Sheet1!A1:B5') or 'gridRange'. Must be provided as a list, e.g., [{'a1Range': 'Sheet1!A1:B5'}]. A single filter object will be automatically wrapped in a list. |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet to retrieve data from. This is the unique identifier found in the spreadsheet URL (e.g., in 'https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit', the ID is the SPREADSHEET_ID part). Typical Google Sheets IDs are approximately 44 characters long and contain alphanumeric characters, hyphens, and underscores. |
| `majorDimension` | string ("ROWS" | "COLUMNS") | No | The major dimension that results should use. For example, if the spreadsheet data is: A1=1,B1=2,A2=3,B2=4, then a request that selects that range and sets majorDimension=ROWS returns [[1,2],[3,4]], whereas a request that sets majorDimension=COLUMNS returns [[1,3],[2,4]]. |
| `valueRenderOption` | string ("FORMATTED_VALUE" | "UNFORMATTED_VALUE" | "FORMULA") | No | How values should be represented in the output. The default render option is FORMATTED_VALUE. |
| `dateTimeRenderOption` | string ("SERIAL_NUMBER" | "FORMATTED_STRING") | No | How dates, times, and durations should be represented in the output. This is ignored if valueRenderOption is FORMATTED_VALUE. The default dateTime render option is SERIAL_NUMBER. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Sheet Properties

**Slug:** `GOOGLESHEETS_UPDATE_SHEET_PROPERTIES`

Tool to update properties of a sheet (worksheet) within a Google Spreadsheet, such as its title, index, visibility, tab color, or grid properties. Use this when you need to modify the metadata or appearance of a specific sheet.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `spreadsheetId` | string | Yes | The ID of the spreadsheet containing the sheet to update. |
| `updateSheetProperties` | object | Yes | The details of the sheet properties to update. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update Spreadsheet Properties

**Slug:** `GOOGLESHEETS_UPDATE_SPREADSHEET_PROPERTIES`

Tool to update SPREADSHEET-LEVEL properties such as the spreadsheet's title, locale, time zone, or auto-recalculation settings. Use when you need to modify the overall configuration of a Google Spreadsheet. NOTE: To update individual SHEET properties (like renaming a specific sheet/tab), use GOOGLESHEETS_UPDATE_SHEET_PROPERTIES instead.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fields` | string | Yes | Field mask specifying which properties to update (comma-separated for multiple fields). Supports nested paths using dot notation (e.g., 'iterativeCalculationSettings.maxIterations') per Protocol Buffers FieldMask specification. The root 'properties' is implied and must not be included. Special case: When updating 'spreadsheetTheme', use the field mask 'spreadsheetTheme' (not nested paths like 'spreadsheetTheme.primaryFontFamily') and provide the complete theme object with all required fields. Wildcard '*' updates all properties. |
| `properties` | object | Yes | The spreadsheet-level properties to update (e.g., title, locale, timeZone, autoRecalc). At least one field within properties must be set. NOTE: To update individual sheet/tab properties (like renaming a specific sheet), use GOOGLESHEETS_UPDATE_SHEET_PROPERTIES instead. |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet to update. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Upsert Rows (Smart Update/Insert)

**Slug:** `GOOGLESHEETS_UPSERT_ROWS`

Upsert rows - update existing rows by key, append new ones. Automatically handles column mapping and partial updates. Use for: CRM syncs (match Lead ID), transaction imports (match Transaction ID), inventory updates (match SKU), calendar syncs (match Event ID). Features: - Auto-adds missing columns to sheet - Partial column updates (only update Phone + Status, preserve other columns) - Column order doesn't matter (auto-maps by header name) - Prevents duplicates by matching key column Example inputs: - Contact update: keyColumn='Email', headers=['Email','Phone','Status'], data=[['john@ex.com','555-0101','Active']] - Inventory sync: keyColumn='SKU', headers=['SKU','Stock','Price'], data=[['WIDGET-001',50,9.99],['GADGET-002',30,19.99]] - CRM lead update: keyColumn='Lead ID', headers=['Lead ID','Name','Score'], data=[['L-12345',85,'Hot']] - Partial update: keyColumn='Email', headers=['Email','Phone'] (only updates Phone, preserves Name/Address/etc)

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `rows` | array | Yes | 2D array of data rows to upsert. IMPORTANT: If 'headers' is NOT provided, the FIRST row is treated as column headers and remaining rows as data - so you need at least 2 rows (1 header + 1 data). If 'headers' IS provided separately, then ALL rows in this array are treated as data rows. Each row should have the same number of values as headers. If a row has MORE values than headers: with strict_mode=true (default), an error is returned showing which rows are affected; with strict_mode=false, extra values are silently truncated. If a row has FEWER values than headers, an error is returned during execution. Cell values can be strings, numbers, booleans, or null. Example with headers provided: headers=['Email','Status'], rows=[['john@ex.com','Active']] (1 data row). Example without headers: rows=[['Email','Status'],['john@ex.com','Active']] (row 1 = headers, row 2 = data). |
| `headers` | array | No | List of column names for the data. These will be matched against sheet headers. If a column doesn't exist in the sheet, it will be added automatically. Order doesn't need to match sheet order. Can be auto-derived from the first row in 'rows' if not provided. Example inputs: ['Email', 'Phone', 'Status'] for contact updates, ['Lead ID', 'Name', 'Score'] for CRM, ['SKU', 'Stock', 'Price'] for inventory. |
| `keyColumn` | string | No | The column NAME (header text) to use as unique identifier for matching rows. Must be an actual header name from the sheet (e.g., 'Email', 'Lead ID', 'SKU'), NOT a column letter (e.g., 'A', 'B', 'C'). If you provide a column letter like 'A', it will be automatically converted to the header name at that column position. If neither 'key_column' nor 'key_column_index' is provided, defaults to the first column (index 0). |
| `sheetName` | string | Yes | The name of the sheet/tab within the spreadsheet. Note: Google Sheets creates default sheets with localized names based on account language (e.g., 'Sheet1' for English, '工作表1' for Chinese, 'Hoja1' for Spanish, 'Feuille1' for French, 'Planilha1' for Portuguese, 'Лист1' for Russian). If you specify a common default name and the sheet is not found, the action will automatically use the first sheet if only one exists. |
| `strictMode` | boolean | No | Controls how rows with mismatched column counts are handled. When True (default), an error is returned if any row has more values than headers - the error message shows exactly which rows are affected and what values would need to be removed. When False, extra values are silently truncated to match the header count. Set to False only if you explicitly want automatic truncation of extra values. |
| `tableStart` | string | No | Cell where the table starts (where headers are located). Defaults to 'A1'. Use this if your table is offset (e.g., 'C5', 'D10'). |
| `spreadsheetId` | string | Yes | The ID of the spreadsheet. Must be a non-empty string, typically a 44-character alphanumeric string found in the spreadsheet URL. |
| `key_column_index` | string | No | The 0-based column index to use as unique identifier for matching rows. Alternative to 'key_column' - will be converted to column name using headers. If neither 'key_column' nor 'key_column_index' is provided, defaults to 0 (first column). Example: 0 for first column, 1 for second column. |
| `normalization_message` | string | No | Internal field to track input normalization (e.g., row truncation). Not part of API. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Get spreadsheet values

**Slug:** `GOOGLESHEETS_VALUES_GET`

Returns a range of values from a spreadsheet. Use when you need to read data from specific cells or ranges in a Google Sheet.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `range` | string | Yes | The A1 notation or R1C1 notation of the range to retrieve values from. If the sheet name contains spaces or special characters, wrap the sheet name in single quotes (e.g., "'My Sheet'!A1:B2"). Without single quotes, the API will return a 400 error for sheet names with spaces. Examples: 'Sheet1!A1:B3', "'Sheet With Spaces'!A1:D5", 'A1:D5' (no sheet name uses first visible sheet), 'Sheet1!A:A' (entire column), 'SheetName' (entire sheet). |
| `spreadsheet_id` | string | Yes | The unique identifier of the Google Spreadsheet from which to retrieve values. This is the long alphanumeric string found in the spreadsheet URL between '/d/' and '/edit' (e.g., '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'). WARNING: Do NOT use the spreadsheet name or title (e.g., 'My Sales Report'); you must use the actual ID from the URL. |
| `major_dimension` | string ("DIMENSION_UNSPECIFIED" | "ROWS" | "COLUMNS") | No | The major dimension for results. |
| `value_render_option` | string ("FORMATTED_VALUE" | "UNFORMATTED_VALUE" | "FORMULA") | No | How values should be rendered in the output. FORMATTED_VALUE: Values are calculated and formatted (default). UNFORMATTED_VALUE: Values are calculated but not formatted. FORMULA: Values are not calculated; the formula is returned instead. |
| `date_time_render_option` | string ("SERIAL_NUMBER" | "FORMATTED_STRING") | No | How dates, times, and durations should be represented in the output. SERIAL_NUMBER: Dates are returned as serial numbers (default). FORMATTED_STRING: Dates returned as formatted strings. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

### Update spreadsheet values

**Slug:** `GOOGLESHEETS_VALUES_UPDATE`

Tool to set values in a range of a Google Spreadsheet. Use when you need to update or overwrite existing cell values in a specific range.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `range` | string | Yes | The A1 notation of the range to update values in (e.g., 'Sheet1!A1:C2', 'MySheet!C:C', or 'A1:D5'). Must be actual cell references, not placeholder values. If the sheet name is omitted (e.g., 'A1:B2'), the operation applies to the first visible sheet. IMPORTANT: The range must not exceed the sheet's grid dimensions. By default, new sheets have 1000 rows and 26 columns (A-Z). If you need to write to columns beyond Z (e.g., AA, AB), first expand the sheet using GOOGLESHEETS_APPEND_DIMENSION or check the current dimensions using GOOGLESHEETS_GET_SPREADSHEET_INFO. |
| `values` | array | Yes | The data to write. This is an array of arrays, the outer array representing all the data and each inner array representing a major dimension. Each item in the inner array corresponds with one cell. |
| `spreadsheet_id` | string | Yes | The unique identifier of the Google Spreadsheet to update. This ID can be found in the URL of the spreadsheet (e.g., https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit). Must be a non-empty string. |
| `major_dimension` | string ("ROWS" | "COLUMNS") | No | The major dimension of the values. ROWS (default) means each inner array is a row of values. COLUMNS means each inner array is a column of values. Defaults to ROWS if unspecified. |
| `auto_expand_sheet` | boolean | No | If True (default), automatically expands the sheet's dimensions (adds columns/rows) when the target range exceeds the current grid limits. If False, the operation will fail with an error if the range exceeds grid limits. |
| `value_input_option` | string ("RAW" | "USER_ENTERED") | Yes | How the input data should be interpreted. RAW: Values are stored exactly as entered, without parsing (dates, formulas, etc. remain as strings). USER_ENTERED: Values are parsed as if typed by a user (numbers stay numbers, strings prefixed with '=' become formulas, etc.). |
| `include_values_in_response` | boolean | No | Determines if the update response should include the values of the cells that were updated. By default, responses do not include the updated values. |
| `response_value_render_option` | string ("FORMATTED_VALUE" | "UNFORMATTED_VALUE" | "FORMULA") | No | Determines how values in the response should be rendered. Only used if includeValuesInResponse is true. FORMATTED_VALUE (default): Values are formatted as displayed in the UI. UNFORMATTED_VALUE: Values are unformatted (numbers, booleans, formulas). FORMULA: Formulas are not evaluated and remain as text. |
| `response_datetime_render_option` | string ("SERIAL_NUMBER" | "FORMATTED_STRING") | No | Determines how dates, times, and durations in the response should be rendered. Only used if includeValuesInResponse is true. SERIAL_NUMBER (default): Dates are returned as numbers. FORMATTED_STRING: Dates are returned as strings formatted per the cell's locale. |

#### Output

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `data` | object | Yes | Data from the action execution |
| `error` | string | No | Error if any occurred during the execution of the action |
| `successful` | boolean | Yes | Whether or not the action execution was successful or not |

## Triggers

### New Rows in Google Sheet

**Slug:** `GOOGLESHEETS_NEW_ROWS_TRIGGER`

**Type:** poll

Simple polling trigger that monitors Google Sheets for new rows.
Detects when new rows are added and returns the complete row data.
Perfect for triggering any workflow based on new sheet entries.

#### Configuration

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `interval` | number | No | Periodic Interval to Check for Updates & Send a Trigger in Minutes |
| `sheet_name` | string | No | The name of the specific sheet within the spreadsheet to monitor |
| `spreadsheet_id` | string | Yes | The unique identifier of the Google Spreadsheet to monitor |
| `start_row` | integer | No | The row number to start monitoring from (1-indexed, typically 2 to skip headers) |

#### Payload

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `detected_at` | string | Yes | ISO timestamp when the row was detected |
| `row_data` | array | Yes | Complete row data as list of strings |
| `row_number` | integer | Yes | The row number in the sheet (1-indexed) |
| `sheet_name` | string | Yes | The sheet name |
| `spreadsheet_id` | string | Yes | The spreadsheet ID |

### New Sheet Added in Google Spreadsheet

**Slug:** `GOOGLESHEETS_NEW_SHEET_ADDED_TRIGGER`

**Type:** poll

Polling trigger that detects when a new sheet is added to a Google Spreadsheet.

#### Configuration

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `interval` | number | No | Periodic Interval to Check for Updates & Send a Trigger in Minutes |
| `spreadsheet_id` | string | Yes | The unique identifier of the Google Spreadsheet to monitor |

#### Payload

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `detected_at` | string | Yes | ISO timestamp when the new sheet was detected |
| `sheet_name` | string | Yes | The name of the new sheet added |
| `spreadsheet_id` | string | Yes | The spreadsheet ID |
