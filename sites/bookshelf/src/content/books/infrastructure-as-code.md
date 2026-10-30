---
title: Infrastructure as Code
author: Kief Morris
genre: "Science & Technology"
color: "#e06a58"
---

## Summary

This book covers in detail, best practices for automating software infrastructure, using infrastructure as code.

**What Is Infrastructure as Code?**

Infrastructure as code is an approach to infrastructure automation based on practices from software development. It puts an emphasis on consistent, repeatable routines for provisioning and changing systems and their configuration. Using Agile engineering practices such as Test Driven Development (TDD), Continuous Integration (CI), and Continuous Delivery (CD), helps make changing infrastructure safe.

**What Are Some Benefits of Infrastructure as Code?**

- It reduces the effort and risk of making changes to infrastructure.
- It enables you to create systems that are reliable, secure, and cost-effective.
- It makes governance, security, and compliance controls visible.

**The Three Core Principles of Infrastructure as Code:**

1. Define Everything as Code
2. Continuously Test and Deliver Everything as You Work
3. Build Your System from Small, Loosely-Coupled Pieces.

### The Business Case for DevOps

DORA (DevOps Research and Assessment), is a research team at Google, that has identified four key metrics for software delivery and operational performance. What they found was that organizations’ that perform well against their goals—revenue, share price, worker productivity, etc.—also perform well against these four metrics and vice versa.

**The Four Key Metrics:**

1. Delivery Lead Time
   - The elapsed time it take to implement, test, and deliver changes to the production system.
2. Deployment frequency
   - How often you deploy changes to production systems.
3. Change Fail Percentage
   - What percentage of changes either cause an impaired service or need immediate correction, such as a rollback or emergency fix.
4. Mean Time to Restore (_MTTR_)
   - How long it takes to restore service when there is an unplanned outage or impairment.

#### Core Practice: Define Everything as Code

Designing your software infrastructure using code enables the ability to make changes rapidly and reliably.

**_Re-usability_**

If you define you infrastructure as code, you can create many instances of it. You can repair or rebuild your things quickly, and other people can build identical instances of the thing.

**_Consistency_**

Things built from code are built the same way every time. This makes system behavior predictable, makes testing more reliable, and enables continuous testing and delivery.

**_Transparency_**

Everyone can see how the thing is built by looking at the code. People can review the code and suggest improvements, learn things to use in other code, gain insight to use when troubleshooting, and review and audit for compliance.

#### Core Practice: Continuously Test and Delivery All Work in Progress

> The idea is to _build quality_ in rather than trying to _test quality_ in.

Effective infrastructure teams are rigorous about testing. The use automation to deploy and test each component of their system, and integrate all the work everyone has in progress. They test as they work, rather than waiting until they've finished (Test-Driven Development (_TDD_))

One part of this that is often overlooked is that involved integrating and testing _all work in progress._ According to Accelerate (a study done by Google's DORA team), teams get better results when everyone integrates their work at least daily. Continuous Integration (_CI_) involves merging in and testing everyone's code throughout development. Continuous Delivery (_CD_) takes this further, keeping the merged code always production-ready.

#### Core Practice: Build Small, Simple Pieces That You Can Change Independently

Teams struggle when their systems are large and tightly coupled. When you look at the codebase of a high performing team, you see that it is composed of small, simple pieces, that each piece is easy to understand and has clearly defined interfaces. This allows the team to easily change each component on its own, and can deploy and test each component in isolation.

## Principles of Cloud Age Infrastructure

The Cloud Age decouples the computing resources from the physical hardware they run on, which of course stills exists, but servers, hard drives and routers float across it. This means that we can now change how we think about, design, and use computing resources. And, this is also where we now must consider some key principles of cloud infrastructure.

### What are they?

There are five principles for building infrastructure in the cloud, they are:

1. Assume systems are unreliable
2. Make everything reproducible
3. Create disposable things
4. Minimize variation
5. Ensure that you can repeat any action

#### Assume Systems are Unreliable

Cloud scale infrastructure involves hundreds of thousands of devices. At this scale, failures happen even when using reliable hardware—and most cloud vendors use cheap, less reliable hardware, detecting and replacing it when it breaks. You cannot treat the infrastructure your system runs on as a stable foundation. Instead, you must design for uninterrupted service when underlying resources change.

#### Make Everything Reproducible

The first principle necessitates the second principle. You'll need to take parts of your systems offline at times, whether to patch or upgrade systems, resize them, redistribute load, or troubleshoot problems.

The best way to make sure you can do this reliably is to make sure you can rebuild its parts effortlessly and reliably. _Effortlessly_ means that there is no need to make any decisions about how to build things. You should define things such as configuration settings, software versions, and dependencies as code. Rebuilding then a simple "yes/no" decision.

**Reproducibility also helps in other areas:**

- Make testing environments that are consistent with production
- Replicate systems across regions for availability
- Add instances on demand to cope with a high load
- Replicate systems to give each customer a dedicated instance

Doing this well allows a team to remove the risk and fear of making changes, and the confidence to handle failures.

#### Create Disposable Things

Building a system that can cope with dynamic infrastructure is one level. The next level is building a system that is itself dynamic. You should be able to gracefully add, remove, start, stop, change, and move the parts of your systems. This is the main idea of cloud native software, it helps abstract its resources (compute, networking, and storage) from physical hardware, and completely decouples application functionality from the infrastructure it runs on.

> Dynamic systems need dynamic tooling. Your monitoring tool should not alert you every time a server goes down during a rebuild, it should warn you however, if something gets into a loop rebuilding itself.

#### Minimize Variation

Keep variation low, make everything reproducible. It's easier to manage one hundred identical serves than five completely different servers. Although, this can cause tension between allowing each team to choose technologies and solutions that are appropriate to their needs, versus keeping the amount of variation in the organization to a manageable level.

**Configuration Drift**

**Resources**

- [Lightweight Governance](http://oreil.ly/d29qg)

#### Ensure That You Can Repeat Any Action

Building upon the reproducibility principle, you should be able to repeat anything you do to your infrastructure. Effective infrastructure teams have a strong scripting culture. If you can script a task, script it. If it's hard to script it, dig deeper. Maybe you'll find a tool that can help or maybe you can simplify the task or handle it differently.

## Infrastructure Platforms

Let us introduce a way to think about the higher-level concerns of your product or platform, the capabilities it provides, and the infrastructure resources you may assemble to provide those capabilities.

### The Parts of an Infrastructure System

**_Applications_**

Applications and services provide capabilities to your organization and its users. Everything else in this model exists to enable this layer.

**_Application Runtime_**

An application runtime provides service and capabilities to the application layer. It can also be called Platform as a Service, and is used to encapsulate things like container clusters, application servers, or operating systems and databases.

**_Infrastructure Platform_**

This encompasses the set of infrastructure resources and tools/services that manage them. It can also be called Infrastructure as a Service.

#### Multi-cloud

Many organizations end up hosting across multiple platforms. A few terms crop up to describe variations of this:

**Hybrid Cloud →** Hosting applications and services for a system across both private and public infrastructure services.

**Cloud Agnostic →** Building systems so that they can be run on multiple cloud platforms.

**Poly-cloud →** Running different applications, services, and systems on more than one public cloud platform.

**Infrastructure as code requires a dynamic infrastructure platform, something that you can use to provision and change resources on demand with an API.**

- **Infrastructure Resources**
  - Compute resources execute code, and can be summed up as execution time on a physical CPU core.
    - Virtual Machines
    - Containers
    - Application hosting clusters
    - Function as a Service/server-less code runtime
  - Storage resources are needed to manage and provide storage to your compute resources, whether or not your application requires it.
    - Structured Data Storage (MySQL, PostgreSQL, MongoDB, etc.)
    - Secrets Management
    - Block and Object Storage
    - Networked Filesystems
  - Network resources enable your infrastructure team to make changes to and provision networking on-demand.
    - Network address blocks
    - API Gateways
    - Virtual Private Networks
    - Load Balancing and Network Access Rules

## Core Practice: Define Everything as Code

This chapter will cover the relevance of different language paradigms to infrastructure as code, low-level and high-level stacks, and when to use either declarative code or programmatic code.

### Why You Should Define Everything as Code

Implementing and managing your systems as code enable you to leverage speed to improve quality.

#### What Can You Define as Code

- An infrastructure stack, which is a collection of elements provisioned from an infrastructure cloud platform
- Elements of a server's configuration, such as files, user accounts, and services and a server's image definition which generates an image for building multiple server instances
- Configuration for operations and delivery services, which includes pipelines and deployments
- Validation rules, which include both automated tests and compliance rules.

> **CHOOSE TOOLS WITH EXTERNALIZED CONFIGURATION**
> Infrastructure as Code, by definition, involves specifying your code in text-based files, that are managed separately from the tools that you use to apply them to your system.
> This enables you to version your infrastructure specifications, trigger automated CI and CD jobs when you make changes and to create delivery pipelines based off of versioned and promoted infrastructure specifications.

> **MANAGE YOUR CODE IN A VERSION CONTROL SYSTEM**
> If you're defining your stuff as code then putting it into a VCS grants you: the ability to trace changes, rollback to previous changes if something breaks, correlate different versions to different failures, give visibility to changes to help better troubleshoot breaking changes, and action-ability which can trigger actions automatically for each change committed

#### Infrastructure Coding Languages

**Domain Specific Languages**

Many stack management tools will use DSLs, tools like Terraform, Cloudformation and, Jenkins, which allows them to expose concepts from their own domain, so that you can directly write code that refers to virtual machines, disk volumes, and network routes. It is mapped directly to the tool you're using.

General purpose programming languages like `bash`, `python` and `ruby` are also used by infrastructure teams to build scripts. This introduce an issue of choosing which paradigm is best fit to what you're trying to accomplish: _Imperative code_ is a set of instructions that specifies how to make a thing happen, whereas, _Declarative code_ specifies what you want, without specifying how to make it happen. The former is useful for defining the desired state of a system, particularly when there isn't much variation in the outcomes you want, the latter is better for building libraries and abstraction layers around your infrastructure tools as they provide better support for writing, testing, and managing libraries. Which is the most important thing as you must treat your infrastructure code as a first-class concern.

Your infrastructure code should be maintained and written in such a manner as it can be read as documentation, this provides benefits:

- New joiners can browse the code to learn about the system
- Team members can read the code, and review commits, to see what other people have done
- Technical reviewers can use the code to assess what to improve
- Auditors can review code and version history to gain an accurate picture of the system

### Building Infrastructure Stacks as Code

What is an infrastructure stack? An infrastructure stack is a collection of infrastructure resources that you define, provision, and update as a unit. You write source code to define those elements, and run a stack management tool in order to make a call to a cloud platform's API that assembles the desired instance of your stack. These tools include: Hashicorp Terraform, AWS Cloud Formation, Pulumi and OpenStack Heat.

#### Stack Code

Each stack is defined by source code that declares what infrastructure elements it should include. Each project would contain the source code that defines the infrastructure for a stack.

#### Stack Instance

You can use a single stack project to provision more than one stack instance. When you run the stack tool for the project, it uses the platform API to ensure the stack instance exists, and to make it match the project code. If the stack instance doesn't exist, than the tool creates it. If the stack instance exists but doesn't exactly match the code, then the tool modifies the instance to make it match.

##### Low-Level Infrastructure Languages

A low-level infrastructure language simply means that it will directly expose the infrastructure resources provided by its platform, making it your job to write the code that wires them together.

##### High-Level Infrastructure Languages

A high-level infrastructure language defines entities that don't exactly map to resources provided by an underlying platform. Meaning that the tool or library that invokes the code will decide what values to use and how to build the resources.

## Patterns and Anti-Patterns for Structuring Stacks

One challenge with infrastructure design is deciding how to size and structure stacks. The following patterns all describe ways of grouping the pieces of a system into one or more stacks.

### Application Group Stack

An _Application Group_ stack includes the infrastructure for multiple related applications or servers.

### Service Stack

A _Service Stack_ manages the infrastructure for each deployable application component in a separate infrastructure stack.

### Micro Stack

The _Micro Stack_ pattern divides the infrastructure for a single service across multiple stacks. For example, you may have a separate stack project each for the networking, servers, and database.

### Monolithic Stack

A Monolithic stack is an infrastructure stack that includes too many elements, making it difficult to maintain. People build monolithic stacks, for simplicity's sake.

Judging whether your infrastructure stack is a monolith or not is a matter of judgement, but you can ask yourself questions about it:

- Are new people taking a while to learn the stack's codebase?
- Do changes to the stack frequently cause problems?
- Is it difficult to understand how the pieces of the stack fit together?
- Do you spend too much time maintaining systems and processes whose purpose is to manage the stack's complexity?

## Building Environments with Stacks

An environment is a collection of software and infrastructure resources organized around a particular purpose, such as to support a testing phase, or to provide service in a geographical region. A stack is a means of defining and managing a collection of infrastructure resources. Therefore, you can implement an environment as a single stack.

### What Environments Are All About

An environment is a collection of operationally related infrastructure resources. That is, the resources in an environment support a particular activity, such as testing or running a system. There are to typical use cases for having multiple environments running the same system. One is to support a delivery process, and the other is to run multiple production instances of the system.

The most familiar use case for multiple environments is to support a progressive software release process, this means that a given build of an application is deployed to each environment in turn to support different development and testing activities until it is finally deployed to the production environment. [*The Path to Production*]

#### Multiple Production Environments

You might also use multiple environments for complete, independent copies of a system in production. There are several reasons to do this.

**Fault Tolerance**

If one environment fails, others can continue to provide service. Doing this could involve a fail over process to shift load from the failed environment.

**Scalability**

You can spread a workload across multiple environments. People often do this geographically, with a separate environment for each region. Multiple environments may be used to achieve both scalability and fault tolerance. If there is failure in one region, the load is shifted to another region's environment until the failure is corrected.

**Segregation**

You may run multiple instances of an application or service for different user bases, such as different clients. Strong segregation may help meet legal or compliance requirements and give greater confidence to customers.

##### Environments, Consistency, and Configuration

Since multiple environments are meant to run instances of the same system, the infrastructure in each environment should be consistent. Consistency is one of the main drivers of Infrastructure as Code.

Differences between environments create the risk of inconsistent behavior. Testing software in one environment might not uncover problems that occur in another. It's even possible that software deploys successfully in some environments but not others.

##### Building Environments with Multiple Stacks

To create multiple environments, you provision an instance of each service stack for each environment.

### Patterns for Building Environments

An environment is a conceptual collection of infrastructure elements, and a stack is a concrete collection of infrastructure elements.

#### Multiple-Environment Stack

A Multiple-Environment Stack defines and manages the infrastructure for multiple environments as a single stack. For example, id there are the environments for testing and running an application a single stack project includes the code for all three of the environments.

##### Motivations

Many people create this type of structure when they're learning a new tool because it seems natural to add new environments into an existing projects.

##### Consequences

When running a tool to update a stack instance, the scope of a potential change is everything in a stack. If you have a mistake or conflict in your code, everything in the stack instance is vulnerable.

#### Copy-Paste Environments

The copy-paste environments anti-pattern uses a separate stack source code project for each infrastructure stack instance.

##### Motivation

Copy-paste environments are an intuitive way to maintain multiple stack environments. They avoid the blast radius problem of the multi-headed stack antipattern. You can also easily customize each stack instance.

##### Consequences

It can be challenging to maintain multiple copy-paste environments. When you want to make a code change, you need to copy it to every project. You probably need to test each instance separately, as a change may work in one but not another. Also, variations can creep in over time.

#### Reusable Stack

A reusable stack is an infrastructure source code project that is used to create the multiple instances of a stack.

##### Motivation

You create a reusable stack to maintain multiple consistent instances of infrastructure. When you make changes to the stack code, you can apply and test it in one instance, and then use the same code version to create or update multiple additional instances. You want to provision new instances of the stack with minimal ceremony.

##### Applicability

You can use a reusable stack for delivery environments or for multiple production environments. This pattern is useful when you don't need much variation between the environments. It is less applicable when environments need to be heavily customized.

##### Consequences

The ability to provision and update multiple stacks form the same project enhances scalability, reliability, and throughput. You can manage more instances with less effort, make changes with a lower risk of failure, and roll out changes to systems more rapidly.

You typically need to configure some aspects of the stack differently for different instances, even if it's just what you name things. Also, you should test your stack code before you apply changes to business-critical infrastructure.

##### Implementation

You create a reusable stack as an infrastructure stack project, and then run the stack management tool each time you want to create or update an instance of the stack.

As a rule, you should use simple parameters to define differences between stack instances—stings, numbers, or in some cases lists. Additionally, the infrastructure created by a reusable stack should not vary much across instances.

## Configuring Stack Instances

Teams managing infrastructure need to decide how to use the features of their preferred tools (i.e., Terraform or CloudFormation), and how to manage and pass configuration values to these tools so that they are defined and applied consistently to each environment.

You can typically manage the passing of these configuration values in many ways, passing them through on the command-line, reading them from a file, or having the infrastructure code retrieve them from a key-value store.

### Design Principle: Keep Parameters Simple

A major reason for defining your infrastructure as code is to ensure systems are consistently configured,. Configurable stack code create the opportunity for inconsistency. This is because the more configurable the stack project, the more difficult it can become to understand the behavior of different instances.

- Prefer simple parameter types: `String`, `Number`, `List`, `Object`
- Minimize the number of parameters that you can set for a stack.
- Avoid using parameters as conditionals that create significant differences in the resulting infrastructure.

### Using Stack Parameters to Create Unique Identifiers

If you create multiple stack instances from the same projects, you may see failures for infrastructure resources that require unique identifiers.

### Patterns for Configuring Stacks

#### Manual Stack Parameters

The most natural approach to provide values for a stack instance is to type the values on the command line manually.

##### Motivation

It's dirt-simple to type values on the command line.

##### Consequences

It's easy to make a mistake when typing values.

#### Stack Environment Variables

The stack environment variables pattern involves setting parameter values as environment variables for the stack tool you use, and is often combined with another pattern to set the environment variables.

##### Motivation

Most platforms and tools support environment variables, so it's easy to do.

##### Applicability

If you're already using environment variables in your system and have suitable mechanisms to manage them, you might find it convenient to use them for stack parameters.

##### Consequences

You need to use an additional pattern to get the values to set. Doing this adds moving parts, making it harder to trace configuration values for any given stack instance. Also, it could be argued that using environment variables directly in your stack code makes it too tightly coupled to the runtime environment.

##### Implementation

To implement this pattern you need to select another pattern [from this list]. This pattern depends also, on how the stack tool gets the environment variables.

#### Scripted Parameters

Scripted parameters involves hard-coding the parameter values into a script that runs the stack tool. You can write a separate script for each environment or a single script that includes the values for all of your environments.

##### Motivation

Scripts are a simple way to capture the values for each instance, avoiding the problems with the manual stack parameters anti-pattern. You can be confident that values are used consistently for each environment. Also, by checking the script into version control, you ensure that you are tracking changes to the configuration values.

##### Applicability

A stack provisioning script is a useful way to set parameters when you have a fixed set of environments that don't change very often. It doesn't require the additional moving parts of some of the other patterns in this chapter. **This pattern is not suitable for secrets.**

##### Consequences

It's common for the commands used to run the stack to to become complicated over time. Provisioning scripts can grow into messy beasts. You should test provisioning scripts since they can be a source of issues with the systems they provision.

##### Implementation

There are two common implementations for this pattern. One is a single script that takes the environment as a command-line argument, with hardcoded parameter values for each environment. Another is a separate script for each stack instance

```bash
/bin
  ├── production.sh
  ├── staging.sh
  └── test.sh
```

#### Stack Configuration Files

Stack configuration files manage parameter values for each instance in a separate file, which you manage in version control with your stack code.

##### Motivation

Creating configuration files for a stack's instances is straightforward, easy to understand and easy to (w/ the help of version control):

- See what values are used for any given environment
- Trace the history for debugging
- Audit Changes

Stack configuration files enforce the separation of configuration from the stack code.

##### Applicability

Stack configuration files are appropriate when the number of environments doesn't change often. They require you to add a file to your project to add a new stack instance. They also require (and help enforce) consistent logic in how different instances are created and updated.

##### Consequences

When you want to create a new stack instance, you need to add a new configuration file to the stack project. Doing this prevents you from automatically creating new environments on the fly. But, parameter files can add friction for changing the configuration of downstream environments in a change delivery pipeline. Also, defining parameter values can be a source of considerable complexity in provisioning scripts.

##### Implementation

You define stack parameter values in a separate file for each environment, and pass the relevant file when running your tool's `build` command. If the system is composed of multiple stacks, then it can get messy to manage configuration across al of the environments. There are two common approaches to organizing parameter files

**One** is to put configuration files for all of the environments with the code for each stack.

**The other,** is to centralize the configuration for all of the stacks in one place.

Each approach can become messy and confusing in its own way. When you need to make a change to all of the things in an environment, making changes to configuration files across dozens of stack projects is painful.

If you want to use configuration files to provide secrets, rather than using a separate pattern for secrets, then you should manage those files outside of the project code checked in to source control.

```bash
stack build --source ./src \
  --config ./env/staging.properties \
  --config ../.secrets/staging.secrets
```

#### Wrapper Stack

A wrapper stack uses an infrastructure stack project for each instance as a wrapper to import a stack code component. Each wrapper project defines the parameter values for one instance of the stack. It then imports a component shared by all of the stack instances.

##### Motivation

A wrapper stack leverages the stack tool's module functionality or library support to reuse shared code across stack instances. You can use the tool's module versioning, dependency management, and artifact repository functionality to implement a change delivery pipeline.

With wrapper stacks, you can write the logic for provisioning and configuring stacks in the same language that you use to define your infrastructure.

##### Consequences

Components add an extra layer of complexity between your stack and the code contained in the component. You now have two levels: the stack project, which contains the wrapper projects, and the component that contains the code for the stack. And, because you have a separate code project for each stack instance, people may be tempted to add custom logic for each instance, this will make the codebase inconsistent and hard to maintain.

##### Implementation

Define the infrastructure code for the stack as a module, according to your tool's implementation. You could put the module code in the same repository with your wrapper stacks, but, this would prevent you from leveraging module versioning functionality.

#### Pipeline Stack Parameters

With the pipeline stack parameters patter, you define values for each instance in the configuration of a delivery pipeline. You can implement these pipelines using a tool like Jenkins.

##### Motivation

If you're using a pipeline tool to run your infrastructure stack tool, it provides the mechanism for storing and passing parameter values to the tool out of the box. Also, configuration values are kept separate from the infrastructure code. You can change configuration values for downstream environments and apply them immediately.

##### Applicability

Teams who are already using a pipeline to apply infrastructure code to environments can easily leverage this to set stack parameters for each environment. However, if a stack requires more than a few parameter values, defining these in the pipeline configuration has serious drawbacks.

##### Consequences

There is a risk of the pipeline configuration becoming complicated and hard to maintain. This means that your pipeline can become a single point of failure, and you may not be able to fix, recover, or rebuild an environment in an emergency until you have recovered the pipeline. It is best to keep the pipeline configuration as small and simple as possible, having most of the logic live in a script called by the pipeline, rather than in its configuration.

##### Implementation

Parameters should be implemented using "as code" configuration of the pipeline tool. Also, many of these tool will provide secrets management features that you can use to pass secrets to your `build` command.

#### Stack Parameter Registry

A stack parameter registry manages the parameter values for stack instances in a central location, rather than with your stack code. The stack tool retrieves the relevant values when it applies the stack code to a given instance.

The author uses the term _configuration registry_ to describe a service that stores configuration values that may be used for many purposes, including service discovery, stack integration, or monitoring configuration.

##### Motivation

Storing parameter values in a registry separates configuration from implementation. Parameters in a registry can be set, used, and viewed by different tools, using different languages and technologies. This helps to reduce coupling between different parts of the system as you can replace any tool that uses the registry without affect any other tool that uses it.

Stack parameter registries are typically tool-agnostic, which allows them to act as a single source-of-truth for infrastructure and even system configuration. This data can be useful in regulated contexts, making it easy to generate reports for auditing.

##### Applicability

If you are using a configuration registry for other purposes, it makes sense to use it as a stack parameter registry, as well.

##### Consequences

A stack parameter registry requires a configuration registry, which is an extra moving part for your overall system. Take the worst-case scenario of the registry service going down, thus becoming unavailable, it may be impossible to re-provision or update the infrastructure stack until you can restore it.

### Configuration Registry

Larger organizations with many teams working across larger systems often find a configuration registry useful:

- For configuring stack instances and managing integration dependencies
- For creating tools, dashboards, and reports for monitoring and auditing your system

#### Implementing a Configuration Registry

There are different ways to build a configuration registry. You can use a registry provided out of the box by your infrastructure automation tool, or you can run a general-purpose registry product.

**Infrastructure Automation Tool Registries:**

- [Chef Infra Server](https://docs.chef.io/server/)
- [PuppetDB](https://puppet.com/docs/puppetdb/latest/index.html)
- [Ansible Tower](https://www.ansible.com/products/tower)

You may be able to use these services with tools outside the toolchain that provides them However, this creates a dependency on whatever toolchain provides the registry service.

**General Purpose Configuration Registries:**

- [Zookeeper](https://zookeeper.apache.org/)
- [etcd](https://etcd.io/)
- [Consul](https://www.consul.io)

These tools are generally compatible with different tools, languages, and systems and avoid locking you into any particular tool chain.

**DIY Configuration Registries**

Rather than using a service, you could instead to roll your own registry server, by storing configuration files in a central location or by using distributed storage.

#### Single or Multiple Configuration Registries?

Combining all configuration values from across all of your systems, services, and tool is an appealing idea. You could keep everything in a single place. However, this isn't always practical in larger, more heterogeneous environments.

It may be better to pull relevant data from across all the services you use, just make sure you know which system is the source of truth for any particular data or configuration item. Some teams set up messaging systems to share configuration data as events. Whenever a system changes a configuration value, it sends an event. Other systems can monitor this event queue for changes to configuration systems in which they are interested.

#### Handling Secrets

Systems need to keep secrets: a tool's or a user's passwords, API keys, Database access information etc.

It's essential to handle these type of secrets in a secure way. From the very beginning, whether you're team uses public or private infrastructure a leaked password can have terrible consequences.

##### Encrypting Secrets

The exception to the rule of never putting a secret in source code is encrypting it in the source code; git-crypt is one tool you can use to accomplish this. The key to decrypt the secret should not be in the repository itself; It would the be available to attackers.

##### Secret-less Authorization

Many services and systems provide ways to authorize an action without using a secret. Most cloud platforms can mark a compute service as "authorized for privileged actions" In some cases this method can be used to avoid the need to provision secrets on infrastructure when it is created.

Tying privileges to a compute instance or network address only shifts the possible attack vector. **You need to put extra effort into protecting privileged resources.**

##### Injecting Secrets at Runtime

When you can't avoid using a secret for a stack or other infrastructure code, you can explore ways to inject the secret at runtime. You'll normally implement it as a stack parameter. There are two different runtime situations to consider: local development and unattended agents. People who work on infrastructure code will often keep secrets in a local file that isn't stored in version control. This file could also be a script that sets secrets in environment variables, and these approaches also work on unattended agents, such as those used for Continuous Integration and Continuous Delivery pipelines. But you'd need to store the secrets on the server or container that runs the agent.

##### Disposable Secrets

A cool thing you can do with dynamic platforms is to create secrets on the fly, and only use them on a "need-to-know" basis.
