import{t as e}from"./sqlite-CTw1UH8W.js";var t={mkdirSync:()=>void 0,existsSync:()=>!1,rmSync:()=>void 0,writeFileSync:()=>void 0,readFileSync:()=>{throw Error(`No file system in the demo.`)},resolve:(...e)=>e.join(`/`),join:(...e)=>e.join(`/`),dirname:e=>e.split(`/`).slice(0,-1).join(`/`)||`.`,basename:e=>e.split(`/`).pop()||``,extname:e=>(/\.[^./]*$/.exec(e)||[``])[0],fileURLToPath:e=>String(e),pathToFileURL:e=>({href:`file://`+e})},n=[`
  CREATE TABLE orgs(id INTEGER PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, created_at TEXT);
  CREATE TABLE users(
    id INTEGER PRIMARY KEY, org_id INT NOT NULL, email TEXT UNIQUE COLLATE NOCASE NOT NULL,
    name TEXT NOT NULL, title TEXT, team TEXT, photo TEXT,
    role TEXT NOT NULL CHECK(role IN ('hire','admin','member')),
    duty TEXT, start_date TEXT, manager_id INT, buddy_id INT, journey_id INT,
    quote TEXT, ask_about TEXT, password_hash TEXT, created_at TEXT, last_seen_at TEXT);
  CREATE TABLE sessions(token_hash TEXT PRIMARY KEY, user_id INT NOT NULL, created_at TEXT, expires_at TEXT);
  CREATE TABLE journeys(id INTEGER PRIMARY KEY, org_id INT NOT NULL, name TEXT NOT NULL, edited_by INT, edited_at TEXT);
  CREATE TABLE stages(
    id INTEGER PRIMARY KEY, org_id INT NOT NULL, journey_id INT NOT NULL, position INT NOT NULL,
    name TEXT NOT NULL, emoji TEXT, tint TEXT, window TEXT, summary TEXT, start_day INT, end_day INT,
    intro_video_id INT);
  CREATE TABLE task_templates(
    id INTEGER PRIMARY KEY, org_id INT NOT NULL, stage_id INT NOT NULL, position INT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('form','sign','video','app','todo','meeting','it')),
    title TEXT NOT NULL, meta TEXT, emoji TEXT,
    owner_role TEXT NOT NULL CHECK(owner_role IN ('hire','people_ops','it','manager','buddy')),
    due_day INT NOT NULL DEFAULT 0, ref TEXT);
  CREATE TABLE hire_tasks(
    id INTEGER PRIMARY KEY, org_id INT NOT NULL, hire_id INT NOT NULL, template_id INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'todo' CHECK(status IN ('todo','done')), done_at TEXT, done_by INT, data TEXT,
    UNIQUE(hire_id, template_id));
  CREATE TABLE videos(
    id INTEGER PRIMARY KEY, org_id INT NOT NULL, kind TEXT NOT NULL CHECK(kind IN ('intro','app','hello','lesson')),
    title TEXT NOT NULL, presenter_id INT, duration_sec INT, status TEXT NOT NULL DEFAULT 'published'
      CHECK(status IN ('published','needs_update','missing')),
    still TEXT, chapters TEXT, caption TEXT, app_key TEXT, position INT DEFAULT 0, flagged INT DEFAULT 0,
    created_at TEXT);
  CREATE TABLE quiz_questions(
    id INTEGER PRIMARY KEY, org_id INT NOT NULL, video_id INT NOT NULL, position INT,
    prompt TEXT NOT NULL, options TEXT NOT NULL, correct_index INT NOT NULL, explanation TEXT, wrong_hint TEXT);
  CREATE TABLE connected_apps(
    id INTEGER PRIMARY KEY, org_id INT NOT NULL, app_key TEXT NOT NULL, stage_id INT, roles TEXT,
    try_items TEXT, house_rules TEXT, owner_id INT, connected_by INT, connected_at TEXT,
    UNIQUE(org_id, app_key));
  CREATE TABLE signatures(hire_id INT NOT NULL, org_id INT NOT NULL, doc_key TEXT NOT NULL, typed_name TEXT, signed_at TEXT,
    PRIMARY KEY(hire_id, doc_key));
  CREATE TABLE form_answers(hire_id INT NOT NULL, org_id INT NOT NULL, form_key TEXT NOT NULL, step INT DEFAULT 1,
    answers TEXT, submitted_at TEXT, updated_at TEXT, PRIMARY KEY(hire_id, form_key));
  CREATE TABLE messages(
    id INTEGER PRIMARY KEY, org_id INT NOT NULL, user_id INT NOT NULL, from_id INT, kind TEXT,
    title TEXT NOT NULL, body TEXT, link TEXT, needs_action INT DEFAULT 0, created_at TEXT, read_at TEXT);
  CREATE TABLE feelings(id INTEGER PRIMARY KEY, org_id INT NOT NULL, hire_id INT NOT NULL, value INT NOT NULL, created_at TEXT);

  CREATE INDEX users_org ON users(org_id);
  CREATE INDEX stages_journey ON stages(org_id, journey_id, position);
  CREATE INDEX tt_stage ON task_templates(org_id, stage_id, position);
  CREATE INDEX ht_hire ON hire_tasks(org_id, hire_id);
  CREATE INDEX videos_org ON videos(org_id, kind);
  CREATE INDEX msg_user ON messages(org_id, user_id, created_at);
  `,`ALTER TABLE videos ADD COLUMN url TEXT;`,`CREATE TABLE buddy_usage(day TEXT NOT NULL, org_id INT NOT NULL, user_id INT NOT NULL, count INT NOT NULL DEFAULT 0, PRIMARY KEY(day, user_id));`,`UPDATE stages SET name = 'Day 1' WHERE name = 'Day One';
   UPDATE stages SET window = replace(window, 'Day One', 'Day 1'), summary = replace(summary, 'Day One', 'Day 1');
   UPDATE task_templates SET title = replace(title, 'Day One', 'Day 1'), meta = replace(meta, 'Day One', 'Day 1');
   UPDATE messages SET title = replace(title, 'Day One', 'Day 1'), body = replace(body, 'Day One', 'Day 1');`,`CREATE TABLE email_settings(
     org_id INTEGER PRIMARY KEY, provider TEXT NOT NULL CHECK(provider IN ('google','microsoft','smtp')),
     from_name TEXT, from_address TEXT, reply_to TEXT,
     smtp_host TEXT, smtp_port INT, smtp_secure INT, smtp_user TEXT, secret_enc TEXT,
     connected_by INT, connected_at TEXT, last_test_at TEXT, last_test_ok INT, last_error TEXT);
   CREATE TABLE invites(
     token_hash TEXT PRIMARY KEY, org_id INT NOT NULL, user_id INT NOT NULL, created_by INT, created_at TEXT,
     expires_at TEXT NOT NULL, used_at TEXT, sent_via TEXT, sent_at TEXT);
   CREATE INDEX invites_user ON invites(org_id, user_id);
   CREATE TABLE oauth_states(state_hash TEXT PRIMARY KEY, org_id INT NOT NULL, user_id INT NOT NULL, provider TEXT NOT NULL, created_at TEXT NOT NULL);
   CREATE TABLE email_log(
     id INTEGER PRIMARY KEY, org_id INT NOT NULL, to_addr TEXT NOT NULL, subject TEXT, kind TEXT,
     provider TEXT, status TEXT NOT NULL CHECK(status IN ('sent','failed','not_sent')), error TEXT, created_at TEXT);
   CREATE INDEX email_log_org ON email_log(org_id, created_at);`,`UPDATE task_templates SET title = replace(title, 'coffee chat with Sam', 'coffee chat with {buddy}');
   UPDATE stages SET summary = replace(summary, 'lunch with Sam', 'lunch with {buddy}');`,`CREATE TEMP TABLE demo_org AS SELECT org_id AS id FROM users WHERE email = 'maya@brightside.test';
   UPDATE users SET quote = replace(replace(quote, 'Maya Chen', 'Hana Liu'), 'Maya', 'Hana') WHERE org_id IN (SELECT id FROM demo_org);
   UPDATE messages SET title = replace(replace(title, 'Maya Chen', 'Hana Liu'), 'Maya', 'Hana'), body = replace(replace(body, 'Maya Chen', 'Hana Liu'), 'Maya', 'Hana') WHERE org_id IN (SELECT id FROM demo_org);
   UPDATE hire_tasks SET data = replace(replace(data, 'Maya Chen', 'Hana Liu'), 'Maya', 'Hana') WHERE data IS NOT NULL AND org_id IN (SELECT id FROM demo_org);
   UPDATE form_answers SET answers = replace(replace(answers, 'Maya Chen', 'Hana Liu'), 'Maya', 'Hana') WHERE org_id IN (SELECT id FROM demo_org);
   UPDATE signatures SET typed_name = replace(replace(typed_name, 'Maya Chen', 'Hana Liu'), 'Maya', 'Hana') WHERE org_id IN (SELECT id FROM demo_org);
   UPDATE videos SET caption = replace(replace(caption, 'Maya Chen', 'Hana Liu'), 'Maya', 'Hana'), title = replace(title, 'Maya', 'Hana') WHERE org_id IN (SELECT id FROM demo_org);
   UPDATE users SET name = 'Hana Liu', email = 'hana@brightside.test', photo = '/photos/hana.jpg' WHERE email = 'maya@brightside.test';
   DROP TABLE demo_org;`],r=()=>new Date().toISOString();function i(r){r!==`:memory:`&&t.mkdirSync(t.dirname(r),{recursive:!0});let i=new e(r);i.exec(`PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 3000;`);let a=i.prepare(`PRAGMA user_version`).get().user_version;for(let e=a;e<n.length;e++){i.exec(`BEGIN`);try{i.exec(n[e]),i.exec(`PRAGMA user_version = ${e+1}`),i.exec(`COMMIT`)}catch(e){throw i.exec(`ROLLBACK`),e}}return i}var a=()=>t.resolve({}.DATA_DIR||`data`,`onboarding-buddy.db`);function o(e,t){e.exec(`BEGIN`);try{let n=t();return e.exec(`COMMIT`),n}catch(t){throw e.exec(`ROLLBACK`),t}}var s=(e,t=null)=>{if(e==null||e===``)return t;try{return JSON.parse(e)}catch{return t}};export{o as a,i,s as n,t as o,r,a as t};