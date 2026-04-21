import { useEffect, useState, useCallback } from "react";
import {
  MessagesSquare,
  Mail,
  Send,
  RefreshCw,
  AlertTriangle,
  Clock,
} from "lucide-react";

const COOP_ORGANIZER_EMAIL = "tmgtyw@gmail.com";
const API_BASE = "/api";

interface ForumPost {
  id: string;
  authorName: string;
  authorEmail?: string | null;
  subject: string;
  message: string;
  createdAt: string;
}

interface NewPostInput {
  authorName: string;
  authorEmail: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: NewPostInput = {
  authorName: "",
  authorEmail: "",
  subject: "",
  message: "",
};

function buildOrganizerEmail(post: ForumPost & { authorEmail?: string | null }) {
  const subject = `[Oregon THW Forum] ${post.subject} — ${post.authorName}`;
  const body = [
    "A new post was published to the Oregon THW Cooperative member forum.",
    "",
    `From:    ${post.authorName}`,
    `Email:   ${post.authorEmail ?? "(not provided)"}`,
    `Subject: ${post.subject}`,
    `Posted:  ${new Date(post.createdAt).toLocaleString()}`,
    "",
    "Message",
    "-------",
    post.message,
    "",
    "— Sent from the Oregon THW Cooperative forum",
  ].join("\n");
  return { subject, body };
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function Forum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [form, setForm] = useState<NewPostInput>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [justPosted, setJustPosted] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/forum/posts`);
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const json = (await res.json()) as { posts: ForumPost[] };
      setPosts(json.posts);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load forum");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!form.authorName.trim()) return setSubmitError("Please enter your name.");
    if (!form.subject.trim()) return setSubmitError("Please enter a subject.");
    if (!form.message.trim()) return setSubmitError("Please enter your message.");
    if (form.authorEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.authorEmail.trim())) {
      return setSubmitError("That email address doesn't look right.");
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/forum/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: form.authorName.trim(),
          authorEmail: form.authorEmail.trim() || null,
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error ?? "Failed to publish post");
      }
      const json = (await res.json()) as { post: ForumPost & { authorEmail?: string | null } };
      setPosts((prev) => [
        {
          id: json.post.id,
          authorName: json.post.authorName,
          subject: json.post.subject,
          message: json.post.message,
          createdAt: json.post.createdAt,
        },
        ...prev,
      ]);
      setJustPosted(json.post.id);
      setForm(EMPTY_FORM);

      if (typeof window !== "undefined") {
        const { subject, body } = buildOrganizerEmail(json.post);
        const mailto = `mailto:${COOP_ORGANIZER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not publish your post.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
          Community discussion
        </p>
        <h1 className="text-3xl font-bold text-foreground mt-1 flex items-center gap-2">
          <MessagesSquare className="w-7 h-7 text-primary" />
          Member forum
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          A shared space for Oregon Traditional Health Workers, prospective members, and allies to
          share questions, success stories, denial patterns, advocacy strategy, and ideas. Every
          post is visible to the whole cooperative.
        </p>
      </div>

      {/* How this works */}
      <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
        <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-sm">
          <p className="font-semibold text-foreground">
            New posts are routed to the cooperative organizer.
          </p>
          <p className="text-muted-foreground mt-0.5">
            When you publish, a notification email is also sent to{" "}
            <a
              href={`mailto:${COOP_ORGANIZER_EMAIL}`}
              className="text-primary font-medium hover:underline"
            >
              {COOP_ORGANIZER_EMAIL}
            </a>{" "}
            so the organizer sees and responds to every conversation. Provide your email if you'd
            like a direct reply; it is shared only with the organizer, never shown publicly.
          </p>
        </div>
      </div>

      {/* Composer */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Start a new post</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Your name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={form.authorName}
                onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground"
                placeholder="e.g. Maria L."
                maxLength={120}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Email (optional, organizer-only)
              </label>
              <input
                type="email"
                value={form.authorEmail}
                onChange={(e) => setForm((f) => ({ ...f, authorEmail: e.target.value }))}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground"
                placeholder="you@example.org"
                maxLength={200}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Subject <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground"
              placeholder="What's this about?"
              maxLength={200}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Message <span className="text-rose-600">*</span>
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={5}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground"
              placeholder="Share a question, a denial pattern, an advocacy idea, a success story…"
              maxLength={5000}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {form.message.length}/5000 characters
            </p>
          </div>

          {submitError && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-rose-800">{submitError}</p>
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-muted-foreground">
              Your post will be visible to all forum visitors and routed by email to the organizer.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Publishing…" : "Publish post"}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Posts list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">
            Recent posts {posts.length > 0 && (
              <span className="text-muted-foreground text-sm font-normal">({posts.length})</span>
            )}
          </h2>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {loadError && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-rose-800">{loadError}</p>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <MessagesSquare className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No posts yet. Start the conversation above.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {posts.map((p) => (
            <div
              key={p.id}
              className={`bg-card border rounded-xl p-5 transition-colors ${
                justPosted === p.id ? "border-primary/50 bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-foreground text-base">{p.subject}</h3>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {timeAgo(p.createdAt)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Posted by <span className="font-medium text-foreground">{p.authorName}</span>
              </p>
              <p className="text-sm text-foreground whitespace-pre-wrap">{p.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
