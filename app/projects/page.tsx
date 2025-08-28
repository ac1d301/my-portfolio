import Link from "next/link";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";
import { Redis } from "@upstash/redis";
import { Eye } from "lucide-react";

const redis = Redis.fromEnv();

export const revalidate = 60;
export default async function ProjectsPage() {
  const views = (
    await redis.mget<number[]>(
      ...allProjects.map((p) => ["pageviews", "projects", p.slug].join(":")),
    )
  ).reduce((acc, v, i) => {
    acc[allProjects[i].slug] = v ?? 0;
    return acc;
  }, {} as Record<string, number>);

  const sorted = allProjects
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    )
    .slice(0, 6); // Show only first 6 projects

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Projects
          </h2>
          <p className="mt-4 text-zinc-400">
            A selection of projects I've worked on.
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2">
  {sorted.map((project) => (
    <Card key={project.slug}>
      <Link href={`/projects/${project.slug}`}>
        <article className="relative flex flex-col justify-between h-full p-4 md:p-8">
          {/* Top: Date + Views */}
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-zinc-100">
              {project.date && (
                <time dateTime={new Date(project.date).toISOString()}>
                  {Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                  }).format(new Date(project.date))}
                </time>
              )}
            </div>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Eye className="w-4 h-4" />
              {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                views[project.slug] ?? 0
              )}
            </span>
          </div>

          {/* Middle: Title + Description */}
          <div>
            <h2 className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">
              {project.title}
            </h2>
            <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
              {project.description}
            </p>
          </div>

          {/* Bottom: Read more */}
          <div className="mt-6">
            <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
              Read more <span aria-hidden="true">&rarr;</span>
            </p>
          </div>
        </article>
      </Link>
    </Card>
  ))}
</div>

      </div>
    </div>
  );
}
